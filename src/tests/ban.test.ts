import request from "supertest"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from 'mongoose'
import { createUser } from './createUser'
import testUsers from "./users"
import {giveBan} from "../controllers/ban"
import app from "../app"
import { authenticator } from "otplib"
import deleteUser from "./deleteUser"


beforeAll(done => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => done())
    .catch(err => console.log(err))
})

const user = testUsers.users[0]
const profile = testUsers.profiles[0]

let userBareSecret:string
  
// Creating users
  
describe("Init", () => {
    test("It should create new user with profile", done => {
        createUser(user, profile).then(({jwt, bareSecret}) => {
            user.jwt = jwt
            userBareSecret = bareSecret
            done()
        })
    })
})

describe("Banning user", () => {
    test("It should bans user", done => {
        giveBan(user.username)
        done()
    })

    test("It should response with error (cannot log into banned account)", done => {
        const token = authenticator.generate(userBareSecret)
        request(app)
        .post("/user/login")
        .send({username: user.username, password: user.password, token, uid: user.uid})
        .then(response => {
            expect(response.statusCode).toEqual(409)
            done()
        })
    })
})

afterAll(done => {
    deleteUser(user, () => {
        mongoose.connection.close()
        done()
    })
})
