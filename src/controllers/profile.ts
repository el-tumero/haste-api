import Profile from "../models/Profile";
import User from "../models/User";
import formatResponse from "./formatResponse";
import ProfileBase from "../types/ProfileBase";
import Joi from "joi";

async function create(username:string, profileData:ProfileBase){

    try {
        await createProfileSchema.validateAsync(profileData)
        const user = await User.findOne({username, profile: {$exists: false}})
        if(user){
            const profile = await Profile.create(profileData)
            await User.updateOne({username}, {profile})
            return formatResponse("done", "Profile successfully created!")
        }
        return formatResponse("conflict", "User already has a profile!")
    } catch (error) {
        if(error.name === "ValidationError") {
            return formatResponse("conflict", error.details[0].message)
        }

        return formatResponse("error", "Something went wrong!") 
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

const createProfileSchema = Joi.object<ProfileBase, true, ProfileBase>({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    localization: Joi.string().required(),
    birthDate: Joi.date().required(),
    sex: Joi.string().required(),
    target: Joi.string().alphanum().required(),
    intimacy: Joi.string().alphanum().required(),
    photos: Joi.array().items(Joi.string()).required(),
    interests: Joi.array().items(Joi.string().max(25)).required(),
    socials: Joi.array().items(Joi.string().max(35)).required(),
    bio: Joi.string().max(255).required()
})


export default {
    create,
    getByUsername
}