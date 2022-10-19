import request from "supertest"
import app from "../app"
import {describe, expect, test, afterAll, beforeAll} from '@jest/globals'
import mongoose from "mongoose"
import testUsers from "./users"

import {predictMatching} from "../controllers/relation"
import { createUser } from "./createUser"
import deleteUser from "./deleteUser"


const user1 = testUsers.users[0]
const profile1 = testUsers.profiles[0]

const user2 = testUsers.users[1]
const profile2 = testUsers.profiles[1]

const user3 = testUsers.users[2]
const profile3 = testUsers.profiles[2]


beforeAll(done => {
    mongoose.connect(process.env.MONGO_URI as string)
    .then(() => done())
    .catch(err => console.log(err))
})

//describe.skip("skip", () => {
    describe("Init", () => {
        test("It should create three new users with profiles", async() => {
            const {jwt: jwt1} = await createUser(user1, profile1)
            const {jwt: jwt2} = await createUser(user2, profile2)
            const {jwt: jwt3} = await createUser(user3, profile3)
            
            user1.jwt = jwt1
            user2.jwt = jwt2
            user3.jwt = jwt3
        })
    })

    describe("Test /profile/suggestion", () => {
        test("It should returns profiles ordered by ai predictions", done => {
            request(app)
            .get("/profile/suggestion?radius=10000")
            .set("Cookie", [user1.jwt])
            .then(response => {
                console.log(response.body)
                // expect(response.statusCode).toBe(200);
                done()
            })
        })
    })
    
    // describe("Predict matchig algorithm",() => {
    //     test("predictMatching()", async() => {
    //         const result = await predictMatching(user1.username, [user2.username, user3.username])
    //         console.log(result)
    //     })
    // })
//})



afterAll(done => {
    deleteUser(user1, () => { // callback hell
        deleteUser(user2, () => {
            deleteUser(user3, () => {
                mongoose.connection.close()
                done()
            })
        })
    })
})
