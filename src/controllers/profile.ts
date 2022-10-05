import Profile from "../models/Profile";
import User from "../models/User";
import formatResponse from "./formatResponse";
import ProfileInput from "../types/ProfileInput";
import Joi from "joi";
import ProfileCreation from "../types/ProfileCreation";
import ProfileBase from "../types/ProfileBase";
import ProfileEdit from "../types/ProfileEdit";

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

// remove?
async function getByUsername(username:string){
    try {
        const data = await User.findOne({username}).populate({
            path: "profile",
            select: "-_id -__v -location"
        })
        .select("profile -_id")

        const profile = data.profile as ProfileBase // false convertion
        
        if(profile) return formatResponse("done", "User's profile data", {profile})

        return formatResponse("notfound", "Profile not found!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
}

async function edit(username:string, newValues:ProfileEdit){
    try {

        await editProfileSchema.validateAsync(newValues)

        const data = await User.findOne({username})
        const profileId = data.profile

        if(profileId){
            try {
                await Profile.updateOne({_id: profileId}, newValues)
                return formatResponse("done", "Profile updated successfully!")
            } catch (error) {
                return formatResponse("conflict", "Values incorrect!")
            }
            
        }

        return formatResponse("notfound", "Profile not found!")
        
    } catch (error) {
        if(error.name === "ValidationError") {
            return formatResponse("conflict", error.details[0].message)
        }
        return formatResponse("notfound", "User not found!")
    }
}

// finds profiles near user in specified radius
async function getByLocation(username: string, radius: string) {

    if(!radius || parseFloat(radius) === NaN || parseFloat(radius) < 0) return formatResponse("error", "Given radius is invalid!")

    try {
        const user = await User.findOne({username}).populate<{profile: ProfileCreation}>({
            path: "profile",
            select: "location -_id"
        })
        .select("profile -_id")

        if(user.profile){
            const profile = user.profile
            const data = await Profile.find({location: {
                $near: {
                  $maxDistance: parseFloat(radius),
                  $geometry: {type: "Point", coordinates: profile.location.coordinates}
                }
            }})
            .select("-_id -location -__v -personality")

            const profiles = data as ProfileBase[] // create profile output type

            return formatResponse("done", "Profiles found!", {profiles}) // ProfileBase[]
        }

        return formatResponse("error", "Profile not created!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
     
}

const editProfileSchema = Joi.object<ProfileEdit, true, ProfileEdit>({
    firstName: Joi.string().alphanum().min(2).max(30),
    birthDate: Joi.date(),
    sex: Joi.string(),
    target: Joi.string().alphanum(),
    intimacy: Joi.string().alphanum(),
    photos: Joi.array().items(Joi.string()),
    interests: Joi.array().items(Joi.string().max(25)),
    socials: Joi.array().items(Joi.string().max(35)),
    bio: Joi.string().max(255),
})

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
    edit,
    getByUsername,
    getByLocation
}