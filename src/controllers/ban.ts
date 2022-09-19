import User from "../models/User";
// import formatResponse from "./formatResponse";

async function giveBan(username:string){
    try {
        await User.updateOne({username}, {banned: true})
        return "user banned"  
    } catch (error) {
        return error
    }
    
}

export {
    giveBan
}