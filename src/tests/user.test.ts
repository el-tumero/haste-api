import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeEach} from '@jest/globals'
import mongoose from "mongoose"
import { authenticator } from "otplib" 
import { v4 as uuid4 } from "uuid"
import { AES } from "crypto-js"
import User from "../models/User"


mongoose.connect(process.env.MONGO_URI as string)
.catch(err => console.log(err))

const user = {
  username: "teeest",
  password: "12345678",
  secret: "",
  uid: uuid4()
}

// secret: "GAXG65LYNEZW25DU",

// /user

describe("Test the /user (POST) path (creating account)", () => {

  test("It should creates a new user", done => {
    const bareSecret = authenticator.generateSecret()
    user.secret = bareSecret
    const secret = AES.encrypt(bareSecret, user.password).toString()
    request(app)
    .post("/user")
    .send({username: user.username, secret})
    .then(response => {
      expect(response.statusCode).toBe(200);
      done()
    })
  })


  test("It should response with error and message 'User with given username already exists!'", done => {
    request(app)
      .post("/user")
      .send({username: user.username, secret: user.secret})
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({state: "conflict", message: "User with given username already exists!"})
        )
        expect(response.statusCode).toBe(409);
        done()
      })
  })

  test("It should response with error (validation error)", done => {
    request(app)
      .post("/user")
      .send({username: "jo", secret: "12"})
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({state: "conflict", message: '"username" length must be at least 3 characters long' })
        )
        expect(response.statusCode).toBe(409);
        done()
      })
  })

})

// /user/login

describe("Test the /user/login (POST) path", () => {
  test("It should response with 'done' state and auth cookies in headers", done => {
    const token = authenticator.generate(user.secret)
    request(app)
      .post("/user/login")
      .send({username: user.username, password: user.password, token, uid: user.uid})
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({state: "done"})
        )
        expect(response.statusCode).toBe(200);
        done()
      })
  })

  test("It should response with error (more than 3 deviced connected with account)", done => {
    (async function() {
      let token = authenticator.generate(user.secret)
      await request(app)
        .post("/user/login")
        .send({username: user.username, password: user.password, token, uid: uuid4()})
      
      token = authenticator.generate(user.secret)
      await request(app)
        .post("/user/login")
        .send({username: user.username, password: user.password, token, uid: uuid4()})
      
      token = authenticator.generate(user.secret)
      const response = await request(app)
      .post("/user/login")
      .send({username: user.username, password: user.password, token, uid: uuid4()})
      
      expect(response.statusCode).toEqual(409)
      done()
    })()  
    })
})



afterAll(done => {
  User.findOneAndDelete({username: user.username}, async(err:Error, doc:any) => {
    mongoose.connection.close() 
    done()
  }) 
})






