import { Response } from "express";
import { ResponseState } from "../../types/ResponseMessage";

export default function statusHandler(state:ResponseState, res:Response){
    if(state === "done") return res.status(200)
    if(state === "error") return res.status(400)
    if(state === "notfound") return res.status(404)
    if(state === "unauthorized") return res.status(401)
    if(state === "conflict") return res.status(409)
    return res.status(400)
}