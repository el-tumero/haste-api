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
  birthDate: new Date("1999-12-12"),
  localization: "Testing Site",
  sex: "male",
  target: "friendships",
  intimacy: "yes",
  photos: ["base64photo1, base64photo2"],
  interests: ["testing apis"],
  socials: ["@test"],
  bio: "Testing in progress..."
}

// Creating a user

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

// Login

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

// /profile

describe("Test the /profile (POST) path", () => {
  test("It should creates a user profile", done => {
    request(app)
    .post("/profile")
    .send(profile)
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns an error (only one profile per user)", done => {
    request(app)
    .post("/profile")
    .send(profile)
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.statusCode).toBe(409);
      done()
    })
  })

  test("It should returns an error (unauthorized)", done => {
    request(app)
    .post("/profile")
    .send(profile)
    .then(response => {
      expect(response.statusCode).toBe(401);
      done()
    })
  })
})

describe("Test the /profile/user/:username (GET) path", () => {
  test("It should returns a user profile", done => {
    request(app)
    .get("/profile/user/" + user.username)
    .then(response => {
      expect(response.body.profile.firstName).toEqual("Test")
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns an error", done => {
    request(app)
    .get("/profile/user/" + "404")
    .then(response => {
      expect(response.statusCode).toBe(404);
      done()
    })
  })
})

describe("Test the /profile (GET) path", () => {
  test("It should returns a user profile", done => {
    request(app)
    .get("/profile")
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.body.profile.firstName).toEqual("Test")
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns an error(unauthorized)", done => {
    request(app)
    .get("/profile")
    .then(response => {
      expect(response.statusCode).toBe(401);
      done()
    })
  })
})

describe("Test the /profile/test (GET) path", () => {
  test("It should returns 200", done => {
    request(app)
    .get("/profile/test")
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns 401", done => {
    request(app)
    .get("/profile/test")
    .then(response => {
      expect(response.statusCode).toBe(401);
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






