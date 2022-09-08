import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import formatResponse from "../controllers/formatResponse";
import statusHandler from "../routes/statusHandler";

const verification = (req:Request, res:Response, next:NextFunction) => {
    console.log(123)
    if(req.cookies.sessionToken){
        try {
            jwt.verify(req.cookies.sessionToken, process.env.PRIVATE_KEY)
            // can save username to cookie eventually
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