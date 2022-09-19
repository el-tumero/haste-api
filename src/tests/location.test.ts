import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import ProfileInput from "../types/ProfileInput"
import {createUser, UserTest} from "./createUser"
import deleteUser from "./deleteUser"
import testUsers from "./users"


beforeAll(done => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => done())
    .catch(err => console.log(err))
})

const user1 = testUsers.users[0]
const profile1 = testUsers.profiles[0]

const user2 = testUsers.users[1]
const profile2 = testUsers.profiles[1]
  
// Creating users
  
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

describe("Location range test", () => {
    test("It should returns two profiles", done => {
        request(app)
        .get("/profile/nearby?radius=4000")
        .set("Cookie", [user1.jwt])
        .then(response => {
            expect(response.body.profiles.length).toEqual(2)
            done()
        })
    })

    test("It should returns two profiles (for diffrent user)", done => {
        request(app)
        .get("/profile/nearby?radius=4000")
        .set("Cookie", [user2.jwt])
        .then(response => {
            expect(response.body.profiles.length).toEqual(2)
            done()
        })
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

