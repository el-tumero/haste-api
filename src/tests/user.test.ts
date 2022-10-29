import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import { v4 as uuid4 } from "uuid"
import User from "../models/User"

const user = {
  phone: "205371349",
  password: "12345678",
  uid: uuid4()
}

beforeAll(async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
  } catch (error) {
    console.log(error)
  }
})


describe("Test the /user (POST) path (creating account)", () => {

  test("It should creates a new user", async ()=> {
    const {phone, password} = user
    const response = await request(app).post("/user").send({phone, password})
    expect(response.statusCode).toBe(200)
  })

  test("It should response with status code 409 (user with given phone number already exists!)", async() => {
    const {phone, password} = user
    const response = await request(app).post("/user").send({phone, password})
    expect(response.statusCode).toBe(409)
  })

  test("It should response with error (validation error)", async() => {
    const response = await request(app).post("/user").send({phone: 123, password: "12"})
    expect(response.statusCode).toBe(409)
  })

})

// /user/activate & /user/code

describe("Test the /user/activate (POST) & /user/code (GET) paths", () => {

  let code = ""

  test("It should response with code", async() => {
    const response = await request(app).get("/user/code").query({phone: user.phone})
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toHaveLength(4)
    console.log(response.body)
    code = response.body.message
  })

  test("It should response with error", async() => {
    const response = await request(app).get("/user/code").query({phone: 123123123})
    expect(response.statusCode).toBe(404)
    console.log(response.body)
  })


  test("It should activate account", async() => {
    const response = await request(app).post("/user/activate").send({phone:user.phone, code})
    console.log(response.body)
    expect(response.statusCode).toBe(200)
  })



})

// /user/login

describe("Test the /user/login (POST) path", () => {
  test("It should response with 'done' state and auth cookies in headers", async() => {
    const {phone, password, uid} = user
    const response = await request(app).post("/user/login").send({phone, password, uid})
    expect(response.statusCode).toBe(200)
  })

  // for ban mechanism
  test.skip("It should response with error (more than 3 deviced connected with account)", async() => {

      const {phone, password} = user

      await request(app)
        .post("/user/login")
        .send({phone, password, uid: uuid4()})
      
      await request(app)
        .post("/user/login")
        .send({phone, password, uid: uuid4()})
      

      const response = await request(app)
      .post("/user/login")
      .send({phone, password, uid: uuid4()})
      
      expect(response.statusCode).toEqual(409)

 
    })
})


afterAll(done => {
  User.findOneAndDelete({phone: user.phone}, async(err:Error, doc:any) => {
    mongoose.connection.close() 
    done()
  }) 
})






