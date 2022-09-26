import Profile from "../models/Profile";
import User from "../models/User";
import formatResponse from "./formatResponse";
import ProfileInput from "../types/ProfileInput";
import Joi from "joi";
import ProfileCreation from "../types/ProfileCreation";
import ProfileBase from "../types/ProfileBase";

async function create(username:string, profileData:ProfileInput){

    try {
        await createProfileSchema.validateAsync(profileData)
        const user = await User.findOne({username, profile: {$exists: false}})
        if(user){
            const profile = await Profile.create({...profileData, location: {type: "Point", coordinates: profileData.location}})
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
            select: "-_id -__v -location"
        })
        .select("profile -_id")

        const profile = data.profile as ProfileBase
        
        if(profile) return formatResponse("done", "User's profile data", {profile})

        return formatResponse("notfound", "Profile not found!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
}

// finds profiles near user in specified radius
async function getByLocation(username: string, radius: string) {

    if(!radius || parseFloat(radius) === NaN || parseFloat(radius) < 0) return formatResponse("error", "Given radius is invalid!")

    try {
        const user = await User.findOne({username}).populate({
            path: "profile",
            select: "location -_id"
        })
        .select("profile -_id")

        if(user.profile){
            const profile = user.profile as ProfileCreation
            const data = await Profile.find({location: {
                $near: {
                  $maxDistance: parseFloat(radius),
                  $geometry: {type: "Point", coordinates: profile.location.coordinates}
                }
            }})
            .select("-_id -location -__v")

            const profiles = data as ProfileBase[]

            return formatResponse("done", "Profiles found!", {profiles}) // ProfileBase[]
        }

        return formatResponse("error", "Profile not created!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
     
}

const createProfileSchema = Joi.object<ProfileInput, true, ProfileInput>({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    location: Joi.array().items(Joi.number()).length(2).required(),
    birthDate: Joi.date().required(),
    sex: Joi.string().required(),
    target: Joi.string().alphanum().required(),
    intimacy: Joi.string().alphanum().required(),
    photos: Joi.array().items(Joi.string()).required(),
    interests: Joi.array().items(Joi.string().max(25)).required(),
    socials: Joi.array().items(Joi.string().max(35)).required(),
    bio: Joi.string().max(255).required(),
    personality: Joi.array().items(Joi.number().min(0).max(100).precision(0)).length(10).required()
})

// ambition, confidence, patience, kindness, creativity, resposibility, optimism, courage, modesty, perseverance

export default {
    create,
    getByUsername,
    getByLocation
}