import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import testUsers from "./users"

import {checkMatching} from "../controllers/relation"
import { createUser } from "./createUser"
import deleteUser from "./deleteUser"

const user1 = testUsers.users[0]
const profile1 = testUsers.profiles[0]

const user2 = testUsers.users[1]
const profile2 = testUsers.profiles[1]

beforeAll(done => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => done())
    .catch(err => console.log(err))
})

describe("Init", () => {
    test("It should create two new users with profiles", done => {
        createUser(user1, profile1).then(obj1 => {
            user1.jwt = obj1.jwt
            createUser(user2, profile2).then(obj2 => {
                user2.jwt = obj2.jwt
                done()
            })
        })
    })
})

describe("Check matching algorithm",() => {
    test("checkMatching()", async() => {
        const result = await checkMatching(user1.username, user2.username)
        console.log(result)

    })
})

afterAll(done => {
    deleteUser(user1, () => {
        deleteUser(user2, () => {
            mongoose.connection.close()
            done()
        })
    })
})
