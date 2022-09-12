import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeEach} from '@jest/globals'
import mongoose from "mongoose"
import User from "../models/User"
import {authenticator} from "otplib"
import { AES } from "crypto-js"
import ProfileBase from "../types/ProfileBase"
import UserBase from "../types/UserBase"
import Profile from "../models/Profile"

mongoose.connect(process.env.MONGO_URI as string)
.catch(err => console.log(err))

const user = {
  id: "",
  username: "testtt",
  password: "12345678",
  secret: "",
  jwt: ""
}

const profile:ProfileBase = {
  firstName: "Test",
  surname: "Test",
  birthDate: new Date("1999-12-12"),
  localization: "Testing Site",
  sex: "male"
}

describe("Test the /user (POST) path", () => {
  test("It should creates a new user", done => {
    const bareSecret = authenticator.generateSecret()
    user.secret = bareSecret
    const secret = AES.encrypt(bareSecret, user.password).toString()
    request(app)
    .post("/user")
    .send({username: user.username, secret})
    .then(response => {
      user.id = response.body.id
      expect(response.statusCode).toBe(200);
        done()
    })
  })
})

describe("Test the /user/login (POST) path", () => {
  test("It should login to a user account", done => {
    const token = authenticator.generate(user.secret)
    request(app)
    .post("/user/login")
    .send({username: user.username, password: user.password, token})
    .then(response => {
      user.jwt = response.headers["set-cookie"][0]
      expect(response.statusCode).toBe(200);
        done()
    })
  })
})

describe("Test the /profile (POST) path", () => {
  test("It should creates a user profile", done => {
    request(app)
    .post("/profile")
    .send({username: user.username, ...profile})
    .then(response => {
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns an error (only one profile per user)", done => {
    request(app)
    .post("/profile")
    .send({username: user.username, ...profile})
    .then(response => {
      expect(response.statusCode).toBe(409);
      done()
    })
  })
})

describe("Test the /profile/:username (POST) path", () => {
  test("It should returns a user profile", done => {
    request(app)
    .get("/profile/" + user.username)
    .then(response => {
      expect(response.body.profile.firstName).toEqual("Test")
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns an error", done => {
    request(app)
    .get("/profile/" + "404")
    .then(response => {
      expect(response.statusCode).toBe(404);
      done()
    })
  })


})

afterAll(done => {
  User.findOneAndDelete({username: user.username}, async(err:Error, doc:any) => {
    await Profile.deleteOne({_id: doc.profile})
    mongoose.connection.close()
    done()
  })    
})






