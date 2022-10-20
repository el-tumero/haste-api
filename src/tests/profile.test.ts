import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import User from "../models/User"


import Profile from "../models/Profile"

import { createUser, UserTest } from "./createUser"

import testUsers from "./users"

beforeAll(done => {
  mongoose.connect(process.env.MONGO_URI as string)
  .then(() => done())
  .catch(err => console.log(err))
})

const user = testUsers.users[0]
const profile = testUsers.profiles[0]

// Creating a user

describe("Init", () => {
  test("It should create new user", done => {
      createUser(user).then(jwt => {
          user.jwt = jwt
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

  test("It should returns an error (passed object doesn't match schema)", done => {
    request(app)
    .post("/profile")
    .send({
      firstName: "Test2"
    })
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

describe("Test the /profile/nearby (GET) path", () => {
  test("It should returns profiles of nearby users (5 km radius)", done => {
    request(app)
    .get("/profile/nearby?radius=5")
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.body).toHaveProperty("profiles")
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns error (radius is not defined)", done => {
    request(app)
    .get("/profile/nearby")
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.statusCode).toBe(400);
      done()
    })
  })

  test("It should returns error (radius is not valid)", done => {
    request(app)
    .get("/profile/nearby?radius=-10")
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.statusCode).toBe(400);
      done()
    })
  })

 
})

describe("Test the /profile/edit (GET) path", () => {
  test("It should change firstName", done => {
    request(app)
    .post("/profile/edit")
    .set("Cookie", [user.jwt])
    .send({firstName: "Jack"})
    .then(response => {
      expect(response.statusCode).toBe(200);
      done()
    })
  })

  test("It should returns Jack as firstName", done => {
    request(app)
    .get("/profile")
    .set("Cookie", [user.jwt])
    .then(response => {
      expect(response.body.profile.firstName).toEqual("Jack")
      expect(response.statusCode).toBe(200);
      done()
    })
  })
})

afterAll(done => {
  User.findOneAndDelete({phone: user.phone}, async(err:Error, doc:any) => {
    if(doc){
      await Profile.deleteOne({_id: doc.profile})
    }
    mongoose.connection.close() 
    done()
  }) 
 
})






