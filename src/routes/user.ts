import { Router } from "express";
import controllers from "../controllers/controllers";
import statusHandler from "./statusHandler";

const user = Router()

user.get("/:id", async (req, res) => {
    const data = await controllers.user.getById(req.params.id)
    
    res.json(data)
})

user.post("/login", async(req, res) => {

    const {sessionToken, ...data}= await controllers.user.login(req.body) 

    if(sessionToken) res.cookie("sessionToken", sessionToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })

    statusHandler(data.state, res)

    res.json(data)
})

user.post("/", async (req, res) => {
    const data = await controllers.user.create(req.body)
    statusHandler(data.state, res)
   
    res.json(data)
})

export default user