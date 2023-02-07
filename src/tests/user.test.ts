import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import { v4 as uuid4 } from "uuid"
import User from "../models/User"

const user = {
  phone: "205371349",
  uid: uuid4()
}

beforeAll(async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
  } catch (error) {
    console.log(error)
  }
})


describe("Test the /user/signup (POST) path (creating account)", () => {

  test("It should creates a new user", async ()=> {
    const {phone} = user
    const response = await request(app).post("/user/signup").send({phone})
    expect(response.statusCode).toBe(200)
  })

  test("It should response with status code 409 (user with given phone number already exists!)", async() => {
    const {phone} = user
    const response = await request(app).post("/user/signup").send({phone})
    expect(response.statusCode).toBe(409)
  })

  // test("It should response with error (validation error)", async() => {
  //   const response = await request(app).post("/user").send({phone: 123, password: "12"})
  //   expect(response.statusCode).toBe(409)
  // })

})

// /user/activate & /user/code

describe("Test the /user/activate (POST) & /user/code (GET) paths", () => {

  let code = ""

  test("It should response with code", async() => {
    const response = await request(app).get("/user/code").query({phone: user.phone})
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toHaveLength(4)
    // console.log(response.body.message)
    code = response.body.message
  })

  test("It should response with error", async() => {
    const response = await request(app).get("/user/code").query({phone: 123123123})
    expect(response.statusCode).toBe(404)
    // console.log(response.body)
  })


  test("It should activate account", async() => {
    const response = await request(app).post("/user/activate").send({phone:user.phone, code})
    expect(response.statusCode).toBe(200)
  })



})

// /user/signin

describe("Test the /user/signin (POST) path", () => {

  let code = ""

  test("It should generate code", async() => {
    const response = await request(app).post("/user/generate").send({phone: user.phone})
    expect(response.statusCode).toBe(200)
  })

  test("It should response with code", async() => {
    const response = await request(app).get("/user/code").query({phone: user.phone})
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toHaveLength(4)
    code = response.body.message
  })

  test("It should response with 'done' state and auth cookies in headers", async() => {
    const {phone, uid} = user
    const response = await request(app).post("/user/signin").send({phone, code, uid})
    expect(response.statusCode).toBe(200)
  })

  test("It should response with 'error' (can't use one code twice)", async() => {
    const {phone, uid} = user
    const response = await request(app).post("/user/signin").send({phone, code, uid})
    expect(response.statusCode).toBe(401)
  })


})

describe("Test the /user?phone= (GET) path", () => {
  test("It should response with 200 (user exists)", async() => {
    const {phone} = user
    const response = await request(app).get("/user").query({phone})
    expect(response.statusCode).toBe(200)
  })

  test("It should response with 404 (user does not exist)", async() => {
    const {phone} = user
    const response = await request(app).get("/user").query({phone: "133445114"})
    expect(response.statusCode).toBe(404)
  })

  test("It should response with 400 (wrong data passed)", async() => {
    const response = await request(app).get("/user").query({phone: 144})
    expect(response.statusCode).toBe(400)
  })
})


afterAll(done => {
  User.findOneAndDelete({phone: user.phone}, async(err:Error, doc:any) => {
    mongoose.connection.close() 
    done()
  }) 
})






