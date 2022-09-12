import { Router } from "express";
import controllers from "../controllers/controllers";
import statusHandler from "./utils/statusHandler";

const profile = Router()

profile.post("/", async (req, res) => {
    const data = await controllers.profile.create(req.body)
    statusHandler(data.state, res)
    res.json(data) 
})

profile.get("/:username", async (req, res) => {
    const data = await controllers.profile.getByUsername(req.params.username)
    statusHandler(data.state, res)
    res.json(data)
})


export default profile