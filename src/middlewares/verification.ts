import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import formatResponse from "../controllers/formatResponse";

export interface RequestWithUsername extends Request {
    username: string
}

const verification = (req:RequestWithUsername, res:Response, next:NextFunction) => {
    if(req.cookies.sessionToken){
        try {
            const { username } = jwt.verify(req.cookies.sessionToken, process.env.PRIVATE_KEY) as {username:string, iat:number, exp:number}
            req.username = username
            next()
            return
        } catch (error) {
            sendVerificationError(res)
            return
        }
    }
    sendVerificationError(res)
}

const sendVerificationError = (res:Response) => {
    const data = formatResponse("error", "Verification error!")
    res.status(401)
    res.json(data)
}

export default verification