import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import ProfileInput from "../types/ProfileInput"
import {createUser, UserTest} from "./createUser"
import deleteUser from "./deleteUser"

beforeAll(done => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => done())
    .catch(err => console.log(err))
})

const user1:UserTest = {
    username: "testtt",
    password: "12345678",
    jwt: ""
}

const profile1:ProfileInput = {
    firstName: "Test",
    birthDate: new Date("1999-12-12"),
    location: [
        21.027649641036987,
        52.1620472834284
    ],
    sex: "male",
    target: "friendships",
    intimacy: "yes",
    photos: ["base64photo1, base64photo2"],
    interests: ["testing apis"],
    socials: ["@test"],
    bio: "Testing in progress..."
}

const user2:UserTest = {
    username: "tttset",
    password: "12345678",
    jwt: ""
}

const profile2:ProfileInput = {
    firstName: "Tset",
    birthDate: new Date("1999-12-13"),
    location: [
        21.01663112640381,
        52.18995679773341
    ],
    sex: "male",
    target: "friendships",
    intimacy: "yes",
    photos: ["base64photo1, base64photo2"],
    interests: ["testing apis & more"],
    socials: ["@tset"],
    bio: "Testing in progress..."
}

  
  // Creating users
  
describe("Init", () => {
    test("It should create two new users with profiles", done => {
        createUser(user1, profile1).then(jwt1 => {
            user1.jwt = jwt1
            createUser(user2, profile2).then(jwt2 => {
                user2.jwt = jwt2
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
})



  
afterAll(done => {
    deleteUser(user1, () => {
        deleteUser(user2, () => {
            mongoose.connection.close()
            done()
        })
    })
})

