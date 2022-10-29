import User from "../models/User";
import Joi from "joi"
import { SHA256 } from 'crypto-js'
import jwt from 'jsonwebtoken'
import formatResponse from './formatResponse'
import { ResponseMessageExtended } from "../types/ResponseMessage";
import IUserLoginClient from "../types/User/IUserLoginClient";
import IUserCreationClient from "../types/User/IUserCreationClient";
import tfa from "./tfa";


async function login(user:IUserLoginClient):Promise<ResponseMessageExtended>{
    try {

        await loginSchema.validateAsync(user)

        const foundUser = await User.findOne({phone: user.phone})

        if(!foundUser.activated) return formatResponse("unauthorized", "The account has not been activated!")

        if(SHA256(user.password).toString() === foundUser.password){
            const sessionToken = jwt.sign({id: foundUser.id}, process.env.PRIVATE_KEY, {expiresIn: '10h'})
            return formatResponse("done", "Logged in!", {sessionToken})
        }

        return formatResponse("unauthorized", "Not valid credentials!")

    } catch (err) {
        return formatResponse("error", "Error with decryption or authentication!")
    }
    
}

async function create(user:IUserCreationClient):Promise<ResponseMessageExtended>{
    try{

        await createSchema.validateAsync(user)

        const password = SHA256(user.password).toString()

        await User.create({
          phone: user.phone,
          password,
          activated: false
        })

        tfa.generateCode(user.phone)

        return formatResponse("done", "Succesfully created a user!")
       
    }catch(err){

        if(err.name === "MongoServerError" && err.code === 11000 ){
            return formatResponse("conflict", "User with given phone number already exists!")
        }

        if(err.name === "ValidationError") {
            return formatResponse("conflict", err.details[0].message)
        }

        return formatResponse("error", "Error!")
    }
}

const createSchema = Joi.object<IUserCreationClient, true, IUserCreationClient>({
    phone: Joi.string().length(9).required(),
    password: Joi.string().min(3).required()
})

const loginSchema = Joi.object<IUserLoginClient, true, IUserLoginClient>({
    phone: Joi.string().length(9).required(),
    password: Joi.string().min(3).required(),
    uid: Joi.string().required()
})

export default {
    create,
    login,
}