import { Router } from "express";
import controllers from "../controllers/controllers";

const user = Router()

user.get("/:id", async (req, res) => {
    const data = await controllers.user.getById(req.params.id)
    res.json(data)
})

user.post("/login", async(req, res) => {
    const data = await controllers.user.login(req.body)
    res.cookie("sessionToken", data.sessionToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    res.json({state: data.state, message: data.message})
})

user.post("/", async (req, res) => {
    const data = await controllers.user.create(req.body)
   
    if(data.state === "Done") res.status(200)
    if(data.state === "Error") res.status(400)
    res.json(data)
})

export default user