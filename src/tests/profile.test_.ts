import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeEach} from '@jest/globals'
import mongoose from "mongoose"
import { authenticator } from "otplib" 


mongoose.connect(process.env.MONGO_URI as string)
.catch(err => console.log(err))

const testUser = {
  id: "631b15d64e57945afbcd89b9",
  username: "test",
  password: "12345678",
  secret: "GAXG65LYNEZW25DU"
}

describe("Test the /profile/:id (GET) path", () => {
  test("It should response with user's profile data", done => {
    request(app)
      .get("/profile/" + testUser.id)
      .then(response => {
        // expect(response.body).toEqual(
        //   expect.objectContaining({id: testUser.id, username: testUser.username})
        // )
        expect(response.statusCode).toBe(200);
        done()
      });
  });

  test("It should response with error", done => {
    request(app)
      .get("/profile/" + "test_test")
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({state: "notfound"})
        )
        expect(response.statusCode).toBe(404);
        done()
      });
  });

});

afterAll(done => {
  mongoose.connection.close()
  done()
})






