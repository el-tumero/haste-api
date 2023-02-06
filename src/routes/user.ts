import { Router } from "express";
import controllers from "../controllers/controllers";
import statusHandler from "./utils/statusHandler";
import cookieSettings from "./utils/cookieSettings";
import verification, { RequestWithId } from "../middlewares/verification";

const user = Router()

user.post("signup", async(req, res) => {

    const data = await controllers.user.create(req.body)
    
    statusHandler(data.state, res)
    res.json(data)
})

user.post("/signin", async(req, res) => {
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
    
    const data = await controllers.user.userExists(req.body)
    
    statusHandler(data.state, res)
    res.json(data)
})

user.post("/activate", async(req, res) => {
    const code = req.body.code as string
    const phone = req.body.phone as string
    const data = await controllers.tfa.activate(phone, code)
    statusHandler(data.state, res)
    res.json(data)
})

user.post("/generate", async(req, res) => {
    const phone = req.body.phone as string
    const data = await controllers.tfa.generateCode(phone)
    statusHandler(data.state, res)
    res.json(data)
})

user.get("/code", async(req, res) => {
    const phone = req.query.phone
    const data = controllers.tfa.displayCode(phone)
    statusHandler(data.state, res)
    res.json(data)
})

export default user