import User from "../models/User";
import Joi from "joi"
import UserCreation from "../types/UserCreation";
import { authenticator } from "otplib";
import { AES, enc } from 'crypto-js'
import UserLogin from "../types/UserLogin";
import jwt from 'jsonwebtoken'
import formatResponse from './formatResponse'
import { ResponseMessageExtended } from "../types/ResponseMessage";

async function login(user:UserLogin):Promise<ResponseMessageExtended>{
    try {
        await loginSchema.validateAsync(user)
        const foundUser = await User.findOne({username: user.username})

        if(foundUser.banned) return formatResponse("conflict", "Your account is permanently banned!")
        if(foundUser.uid.length >= 3) return formatResponse("conflict", "You cannot log in on more than 3 devices!") 
        if(!foundUser.uid.includes(user.uid)) await User.updateOne({username: user.username}, {$push: {uid: user.uid}})

        const bytes = AES.decrypt(foundUser.secret, user.password)
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

        if(err.name === "MongoServerError" && err.code === 11000 ){
            return formatResponse("conflict", "User with given username already exists!")
        }

        if(err.name === "ValidationError") {
            return formatResponse("conflict", err.details[0].message)
        }

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
    token: Joi.string().alphanum().length(6).required(),
    uid: Joi.string().required()
})

export default {
    create,
    login
}