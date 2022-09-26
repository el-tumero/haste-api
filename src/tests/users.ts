import { UserTest } from "./createUser"
import {v4 as uuidv4} from "uuid"
import ProfileInput from "../types/ProfileInput"

const user1:UserTest = {
    username: "testtt",
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
    bio: "Testing in progress...",
    personality: [12, 13, 83, 8, 94, 39, 37, 60, 6, 31]
}

const user2:UserTest = {
    username: "tttset",
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
    bio: "Testing in progress...",
    personality: [60, 44, 93, 34, 26, 86, 98, 97, 84, 86]
}

export default { users: [user1, user2], profiles: [profile1, profile2]}