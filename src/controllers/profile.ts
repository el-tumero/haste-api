// async function getById(id:string){

// }

import ProfileCreation from "../types/ProfileCreation";
import Profile from "../models/Profile";
import User from "../models/User";
import formatResponse from "./formatResponse";
import ProfileBase from "../types/ProfileBase";

async function create(profileCreation:ProfileCreation){

    // only one profile per user!
    const {username, ...profileData} = profileCreation

    try {
        const user = await User.findOne({username, profile: {$exists: false}})
        if(user){
            const profile = await Profile.create(profileData)
            await User.updateOne({username}, {profile})
            return formatResponse("done", "Profile successfully created!")
        }
        return formatResponse("conflict", "User already has a profile!")
    } catch (error) {
        console.log(error)
        return formatResponse("conflict", "Wrong values in fields") // later JOI & more
    }

}

async function getByUsername(username:string){
    try {
        const data = await User.findOne({username}).populate({
            path: "profile",
            select: "-_id -__v"
        })
        .select("profile -_id")
        
        if(data.profile) return formatResponse("done", "User's profile data", {profile: data.profile as ProfileBase})

        return formatResponse("notfound", "Profile not found!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
}

export default {
    create,
    getByUsername
}