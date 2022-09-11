import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeEach} from '@jest/globals'
import mongoose from "mongoose"
import { authenticator } from "otplib" 
// import formatResponse from "../controllers/formatResponse"

mongoose.connect(process.env.MONGO_URI as string)
.catch(err => console.log(err))

const testUser = {
  id: "631b15d64e57945afbcd89b9",
  username: "test",
  password: "12345678",
  secret: "GAXG65LYNEZW25DU"
}

// /user/:id

describe("Test the /user/:id (GET) path", () => {
  test("It should response with user data", done => {
    request(app)
      .get("/user/" + testUser.id)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({id: testUser.id, username: testUser.username})
        )
        expect(response.statusCode).toBe(200);
        done()
      });
  });

  test("It should response with error", done => {
    request(app)
      .get("/user/" + "test_test")
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({state: "notfound"})
        )
        expect(response.statusCode).toBe(404);
        done()
      });
  });

});

// /user

describe("Test the /user (POST) path (creating account)", () => {
  test("It should response with error and message 'User with given username already exists!'", done => {
    request(app)
      .post("/user")
      .send({username: testUser.username, secret: testUser.secret})
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
    const token = authenticator.generate(testUser.secret)
    request(app)
      .post("/user/login")
      .send({username: testUser.username, password: testUser.password, token})
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({state: "done"})
        )
        expect(response.statusCode).toBe(200);
        done()
      })
  })
})


afterAll(done => {
  mongoose.connection.close()
  done()
})






