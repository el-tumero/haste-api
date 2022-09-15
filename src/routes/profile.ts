import { Router } from "express";
import controllers from "../controllers/controllers";
import statusHandler from "./utils/statusHandler";
import verification, {RequestWithUsername} from "../middlewares/verification";

const profile = Router()

profile.post("/", verification, async (req:RequestWithUsername, res) => {
    const data = await controllers.profile.create(req.username, req.body)
    statusHandler(data.state, res)
    res.json(data) 
})

profile.get("/", verification, async (req:RequestWithUsername, res) => {
    const data = await controllers.profile.getByUsername(req.username)
    statusHandler(data.state, res)
    res.json(data)
})

profile.get("/user/:username", async (req, res) => {
    const data = await controllers.profile.getByUsername(req.params.username)
    statusHandler(data.state, res)
    res.json(data)
})

profile.get("/test", verification, async (req, res) => {
    res.status(200).json({"status": "done"})
})


export default profile