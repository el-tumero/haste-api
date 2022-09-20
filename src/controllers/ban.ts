import {Error as MongooseError} from "mongoose";
import Ban from "../models/Ban";
import User from "../models/User";
// import formatResponse from "./formatResponse";

async function giveBan(username:string){
    try {
        const user = await User.findOneAndUpdate({username}, {banned: true})
        const docs = user.uid.map((value) => ({"uid": value}))
        await Ban.insertMany(docs)
        return "user banned"  
    } catch (error) {
        if(error instanceof MongooseError) return error
    }
}

async function unban(username:string){
    try {
        const user = await User.findOneAndUpdate({username}, {banned: false})
        // const docs = user.uid.map((value) => ({"uid": value}))
        // console.log(docs)
        await Ban.deleteMany({
            "uid": { $in: user.uid}
        })

        return "user unbanned"
    } catch(error) {
        if(error instanceof MongooseError) return error
    }
}

async function giveUidBan(uid:string){
    try {
        await Ban.create({uid})
        return "uid banned"  
    } catch (error) {
        if(error instanceof MongooseError) return error
    }
}

async function checkIfUidIsBanned(uid:string){
    try {
        const result = await Ban.findOne({uid})
        if(result) return true
        return false
    } catch (error) {
        if(error instanceof MongooseError) return error
    }
}

export {
    giveBan,
    giveUidBan,
    unban,
    checkIfUidIsBanned
}