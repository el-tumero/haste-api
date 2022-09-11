import {describe, expect, test} from '@jest/globals'
import request from "supertest"
import app from "../app"

// /

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.text).toBe("haste-api")
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});