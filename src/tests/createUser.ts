import { AES } from "crypto-js";
import { authenticator } from "otplib";
import request from "supertest"
import app from "../app"
import ProfileInput from "../types/ProfileInput";

interface UserTest {
    username: string
    password: string
    jwt: string
}

async function createUser(user:UserTest, profile:ProfileInput) {
    const bareSecret = authenticator.generateSecret()
    const secret = AES.encrypt(bareSecret, user.password).toString()

    // creation
    await request(app).post("/user").send({username: user.username, secret})

    // login
    const token = authenticator.generate(bareSecret)
    const response = await request(app).post("/user/login").send({username: user.username, password: user.password, token})
    const jwt = response.headers["set-cookie"][0]

    await request(app).post("/profile").send(profile).set("Cookie", [jwt])

    return jwt
}

export {UserTest, createUser}

