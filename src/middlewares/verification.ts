import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import formatResponse from "../controllers/formatResponse";

export interface RequestWithId extends Request {
    id: string
}

const verification = (req:RequestWithId, res:Response, next:NextFunction) => {
    if(req.cookies.sessionToken){
        try {
            const { id } = jwt.verify(req.cookies.sessionToken, process.env.PRIVATE_KEY) as {id:string, iat:number, exp:number}
            req.id = id
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
    const data = formatResponse("unauthorized", "Verification error!")
    res.status(401)
    res.json(data)
}

export default verification