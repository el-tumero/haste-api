import request from "supertest"
import app from "../app"
import IProfileCreationClient from "../types/Profile/IProfileCreationClient";
import User from "../models/User"
import { SHA256 } from "crypto-js";

interface UserTest {
    phone: string
    password: string
    jwt: string
    uid: string
}

async function createUser(user:UserTest, profile?:IProfileCreationClient) {


    // creation
    //await request(app).post("/user").send({phone: user.phone, password: user.password})
    
    const password = SHA256(user.password).toString()

    await User.create({
        phone: user.phone,
        password,
        activated: true
    })


    // login
    const response = await request(app).post("/user/login").send({phone: user.phone, password: user.password, uid: user.uid})
    const jwt = response.headers["set-cookie"][0]

    if(profile){
        await request(app).post("/profile").send(profile).set("Cookie", [jwt])
    }
    
    return jwt
}

export {UserTest, createUser}

