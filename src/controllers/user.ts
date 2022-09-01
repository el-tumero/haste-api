import User from "../models/User";
import Joi from "joi"
import UserInput from "../types/UserInput";
import { authenticator } from "otplib";
import { AES, enc } from 'crypto-js'
import UserLogin from "../types/UserLogin";


async function getById(id:string){
    return await User.findById(id, 'username names surname age').exec()
}


async function login(user:UserLogin){
    try {
        await loginSchema.validateAsync(user)
        const encryptedSecret = await User.findOne({username: user.username}, 'key').exec()
        const bytes = AES.decrypt(encryptedSecret.key, user.password)
        const secret = bytes.toString(enc.Utf8)

        if(user.token === authenticator.generate(secret)){
            return {
                state: "Done",
                message: "Logged in!"
            }
        }
        return {
            state: "Error",
            message: "Not valid credentials!"
        }

    } catch (err) {
        return {
            state: "Error",
            message: "Error with decryption or authentication!"
        }
    }
    
}

async function create(user:UserInput){
    try{
        await createSchema.validateAsync(user)
        const secret = authenticator.generateSecret()

        const encryptedSecret = AES.encrypt(secret, user.password).toString()

        const {_id} = await User.create({
            username: user.username,
            names: user.names,
            surname: user.surname,
            age: user.age,
            key: encryptedSecret
        })

        return {
            state: "Done",
            message: "Succesfully created a user!",
            id: _id,
            secret,
        }
    }catch(err){
        return {
            state: "Error",
            message: err
        }
    }
}

const createSchema = Joi.object<UserInput, true, UserInput>({
    username: Joi.string().alphanum().min(3).max(20).required(),
    names: Joi.string().alphanum().min(2).max(30),
    surname: Joi.string().alphanum().min(2).max(20),
    age: Joi.number().integer().greater(3).less(120),
    password: Joi.string().alphanum().min(8).max(250).required()
})

const loginSchema = Joi.object<UserLogin, true, UserLogin>({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().alphanum().min(8).required(),
    token: Joi.string().alphanum().length(6).required()
})

export default {
    getById,
    create,
    login
}