import User from "../models/User";
import Joi from "joi"
import UserCreation from "../types/UserCreation";
import { authenticator } from "otplib";
import { AES, enc } from 'crypto-js'
import UserLogin from "../types/UserLogin";
import jwt from 'jsonwebtoken'
import formatResponse from './formatResponse'
import { ResponseMessageExtended } from "../types/ResponseMessage";


async function getById(id:string){
    try {
        const { username } = await User.findById(id, 'username').exec()
        return formatResponse("done", "A user with the given id has been found!", {id, username})
    }
    catch (err) {
        return formatResponse("notfound", "User with given id doesn't exists!")
    }
    
}

async function login(user:UserLogin):Promise<ResponseMessageExtended>{
    try {
        await loginSchema.validateAsync(user)
        const encryptedSecret = await User.findOne({username: user.username}, 'secret').exec()
        const bytes = AES.decrypt(encryptedSecret.secret, user.password)
        const secret = bytes.toString(enc.Utf8)

        if(user.token === authenticator.generate(secret)){
            const sessionToken = jwt.sign({username: user.username}, process.env.PRIVATE_KEY, {expiresIn: '10h'})
            return formatResponse("done", "Logged in!", {sessionToken})
        }
        return formatResponse("unauthorized", "Not valid credentials!")

    } catch (err) {
        return formatResponse("error", "Error with decryption or authentication!")
    }
    
}

async function create(user:UserCreation):Promise<ResponseMessageExtended>{
    try{

        await createSchema.validateAsync(user)

        const {_id} = await User.create({
            username: user.username,
            secret: user.secret
        })

        return formatResponse("done", "Succesfully created a user!", {id: _id.toString()})

    }catch(err){
        return formatResponse("error", "Error!")
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