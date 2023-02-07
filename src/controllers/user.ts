import User from "../models/User";
import Joi from "joi"
import { SHA256 } from 'crypto-js'
import jwt from 'jsonwebtoken'
import formatResponse from './formatResponse'
import { ResponseMessageExtended } from "../types/ResponseMessage";
import IUserBase from "../types/User/IUserBase";
import IUserLoginClient from "../types/User/IUserLoginClient";
import IUserCreationClient from "../types/User/IUserCreationClient";
import tfa from "./tfa";

async function userExists(phone:any): Promise<ResponseMessageExtended>{
    try {

        if(typeof phone !== "string" || phone.length != 9) throw Error()
        const found = await User.findOne({phone})

        if(!found) return formatResponse("notfound", "User doesn't exist")
        return formatResponse("done", "User exists")
        
    } catch (err) {
        return formatResponse("error", "Error checking user")
    }
}

async function login(user:IUserLoginClient):Promise<ResponseMessageExtended>{
    try {

        await loginSchema.validateAsync(user)

        const foundUser = await User.findOne({phone: user.phone})

        if(!foundUser.activated) return formatResponse("unauthorized", "The account has not been activated!")

        if(user.code === tfa.displayCode(user.phone).message){
            tfa.deleteCode(user.phone)
            const sessionToken = jwt.sign({id: foundUser.id}, process.env.PRIVATE_KEY, {expiresIn: '10h'})
            return formatResponse("done", "Logged in!", {sessionToken})
        }

        return formatResponse("unauthorized", "Not valid credentials!")

    } catch (err) {
        return formatResponse("error", "Error with authentication!")
    }
    
}

async function create(user:IUserCreationClient):Promise<ResponseMessageExtended>{
    try{

        await createSchema.validateAsync(user)

        await User.create({
          phone: user.phone,
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
})

const loginSchema = Joi.object<IUserLoginClient, true, IUserLoginClient>({
    phone: Joi.string().length(9).required(),
    code: Joi.string().length(4).required(),
    uid: Joi.string().required()
})

export default {
    userExists,
    create,
    login,
}