import { UserTest } from "./createUser"
import {v4 as uuidv4} from "uuid"
import ProfileInput from "../types/ProfileInput"

const user1:UserTest = {
    phone: "123123123",
    password: "12345678",
    jwt: "",
    uid: uuidv4()
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
    bio: "Testing in progress...1",
    personality: Array(10).fill(0).map(value => value = Math.floor(Math.random() * 101))
}

const user2:UserTest = {
    phone: "234234234",
    password: "12345678",
    jwt: "",
    uid: uuidv4()
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
    bio: "Testing in progress...2",
    personality: Array(10).fill(0).map(value => value = Math.floor(Math.random() * 101))
}

const user3:UserTest = {
    phone: "345345345",
    password: "12345678",
    jwt: "",
    uid: uuidv4()
}

const profile3:ProfileInput = {
    firstName: "Test2",
    birthDate: new Date("1999-12-14"),
    location: [
        21.045757,
        52.147581
    ],
    sex: "male",
    target: "friendships",
    intimacy: "yes",
    photos: ["base64photo1, base64photo2"],
    interests: ["testing apis & more"],
    socials: ["@tset"],
    bio: "Testing in progress...3",
    personality: Array(10).fill(0).map(value => value = Math.floor(Math.random() * 101))
}

export default { users: [user1, user2, user3], profiles: [profile1, profile2, profile3]}