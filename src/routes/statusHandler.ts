import { Response } from "express";

export default function statusHandler(state:"done" | "error", res:Response){
    if(state === "done") return res.status(200)
    return res.status(400)
}