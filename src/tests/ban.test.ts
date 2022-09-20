import request from "supertest"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from 'mongoose'
import { createUser } from './createUser'
import testUsers from "./users"
import {giveBan, unban} from "../controllers/ban"
import app from "../app"
import { authenticator } from "otplib"
import deleteUser from "./deleteUser"
import {v4 as uuidv4} from "uuid"
import User from "../models/User"
import Ban from "../models/Ban"



beforeAll(done => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => done())
    .catch(err => console.log(err))
})

const user = testUsers.users[0]
const profile = testUsers.profiles[0]

const secondUser = testUsers.users[1]
const secondProfile = testUsers.profiles[1]

let userBareSecret:string
let secondUserBareSecret:string  
// Creating users
  
describe("Init", () => {
    test("It should create two new users with profiles", async() => {
        const createdUser1 = await createUser(user, profile)
        user.jwt = createdUser1.jwt
        userBareSecret = createdUser1.bareSecret

        const createdUser2 = await createUser(secondUser, secondProfile)
        secondUser.jwt = createdUser2.jwt
        secondUserBareSecret = createdUser2.bareSecret
    })
})

describe("Banning user", () => {
    test("It should bans user", async() => {
        await giveBan(user.username)
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

describe("Unbanning user", () => {
    test("It should unbans user", async() => {
        await unban(user.username)
    }) 
})

describe("Advanced banning", () => {
    test("It should log in from another device (after unban)", done => {
        const token = authenticator.generate(userBareSecret)
        request(app)
        .post("/user/login")
        .send({username: user.username, password: user.password, token, uid: uuidv4()})
        .then(response => {
            expect(response.statusCode).toEqual(200)
            done()
        })
    }) 

    test("It should returns 2 uids connected with account", done => {
        User.findOne({username: user.username})
        .then(data => {
            expect(data?.uid.length).toEqual(2)
            done()
        })
    })

    test("It should bans user", done => {
        giveBan(user.username)
        .then(() => {
            Ban.find({}).then(data => {
                expect(data.length).toEqual(2)
                done()
            })
        })
    })

    test("It should response with error (given uuid is banned)", done => {
        const token = authenticator.generate(secondUserBareSecret)
        request(app)
        .post("/user/login")
        .send({username: secondUser.username, password: secondUser.password, token, uid: user.uid}) // user1 uid
        .then(response => {
            expect(response.statusCode).toEqual(409)
            done()
        })
    })

    test("It should unbans users and uids", done => {
        unban(secondUser.username).then(() => {
            unban(user.username).then(() => done())
        })
        
    })
    
})


afterAll(done => {
    deleteUser(user, () => {
        deleteUser(secondUser, () => {
            mongoose.connection.close()
            done()
        })
    })

    // mongoose.connection.close()
    // done()
})
