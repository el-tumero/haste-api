import User from "../models/User";
import Joi from "joi"
import UserCreation from "../types/UserCreation";
import { authenticator } from "otplib";
import { AES, enc } from 'crypto-js'
import UserLogin from "../types/UserLogin";


async function getById(id:string){
    return await User.findById(id, 'username names surname age').exec()
}

async function login(user:UserLogin){
    try {
        await loginSchema.validateAsync(user)
        const encryptedSecret = await User.findOne({username: user.username}, 'secret').exec()
        const bytes = AES.decrypt(encryptedSecret.secret, user.password)
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

async function create(user:UserCreation){
    try{

        await createSchema.validateAsync(user)

        const {_id} = await User.create({
            username: user.username,
            secret: user.secret
        })

        return {
            state: "Done",
            message: "Succesfully created a user!",
            id: _id
        }

    }catch(err){
        return {
            state: "Error",
            message: err
        }
    }
}

const createSchema = Joi.object<UserCreation, true, UserCreation>({
    username: Joi.string().alphanum().min(3).max(20).required(),
    secret: Joi.string().required()
})

const loginSchema = Joi.object<UserLogin, true, UserLogin>({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).required(),
    token: Joi.string().alphanum().length(6).required()
})

export default {
    getById,
    create,
    login
}