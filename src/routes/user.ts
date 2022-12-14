import { Router } from "express";
import controllers from "../controllers/controllers";
import statusHandler from "./utils/statusHandler";
import cookieSettings from "./utils/cookieSettings";

const user = Router()

user.post("/login", async(req, res) => {
    const {sessionToken, ...data}= await controllers.user.login(req.body) 
    if(sessionToken) res.cookie("sessionToken", sessionToken, cookieSettings)
    
    statusHandler(data.state, res)
    res.json(data)
})

user.post("/logout", async(req, res) => {
    const {expires, ...restSettings} = cookieSettings
    res.clearCookie("sessionToken", restSettings)
    
    statusHandler("done", res)
    res.json({state: "done", message: "Succesfully logged out!"})
})

user.post("/", async (req, res) => {
    const data = await controllers.user.create(req.body)
    
    statusHandler(data.state, res)
    res.json(data)
})

export default user