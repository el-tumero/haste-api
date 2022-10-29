import Profile from "../models/Profile";
import User from "../models/User";
import formatResponse from "./formatResponse";
import Joi from "joi";

import IProfileCreation from "../types/Profile/IProfileCreation";
import IProfileBase from "../types/Profile/IProfileBase";
import IProfileCreationClient from "../types/Profile/IProfileCreationClient";
import IProfileEditClient from "../types/Profile/IProfileEditClient";


import { predictMatching } from "./relation";
import { Types } from "mongoose";


async function create(id:string, profileData:IProfileCreationClient){
    try {
        await createProfileSchema.validateAsync(profileData)
        const user = await User.findOne({_id: id, profile: {$exists: false}})
        if(user){
            const profile = await Profile.create({...profileData, location: {type: "Point", coordinates: profileData.location}})
            await User.updateOne({_id: id}, {profile})
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

// to rebuild?
async function getById(id:string){
    try {
        const data = await User.findById(id).populate({
            path: "profile",
            select: "-_id -__v -location"
        })
        .select("profile -_id")

        const profile = data.profile as IProfileBase // false convertion
        
        if(profile) return formatResponse("done", "User's profile data", {profile})

        return formatResponse("notfound", "Profile not found!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
}

async function edit(id:string, newValues:IProfileEditClient){
    try {
        await editProfileSchema.validateAsync(newValues)

        const data = await User.findOne({_id: id})
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
async function getByLocation(id: string, radius: string) {

    if(!radius || parseFloat(radius) === NaN || parseFloat(radius) < 0) return formatResponse("error", "Given radius is invalid!")

    try {
        const user = await User.findById(id).populate<{profile: IProfileCreation}>({
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

            const profiles = data as IProfileBase[] // create profile output type

            return formatResponse("done", "Profiles found!", {profiles}) 
        }

        return formatResponse("error", "Profile not created!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }
     
}

async function getBySuggestion(id:string, radius:string){
    if(!radius || parseFloat(radius) === NaN || parseFloat(radius) < 0) return formatResponse("error", "Given radius is invalid!")

    try {
        const user = await User.findById(id).populate<{profile: IProfileCreation & {_id:Types.ObjectId}}>({
            path: "profile",
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
            .select("-location -__v")

            const senderPersonality = user.profile.personality



            // console.log(user.profile._id)

            const others = data.filter(obj => !obj._id.equals(user.profile._id))

            const othersPersonalities = others.map(obj => obj.personality)

            // console.log(user.profile)
            // console.log(others)
            // console.log(othersPersonalities)
            // console.log(senderPersonality)

            const predictions = await predictMatching(senderPersonality, othersPersonalities)

            // delete this any types!!!

            const orderedProfiles:any = {}

            for(let i=0; i<predictions.length; i++){
                orderedProfiles[predictions[i]] = others[i]
            }

            predictions.sort((a, b) => b - a)

            const result:any = []

            predictions.forEach(prediction => {
                result.push(orderedProfiles[prediction])
            })


            // console.log(others)
            // console.log(result)

            // console.log(orderedProfiles)
            // console.log(predictions)

            return formatResponse("done", "Profiles ordered", {profiles: result})
        }

        return formatResponse("error", "Profile not created!")
        
    } catch (error) {
        return formatResponse("notfound", "User not found!")
    }

}

const editProfileSchema = Joi.object<IProfileEditClient, true, IProfileEditClient>({
    firstName: Joi.string().alphanum().min(2).max(30),
    birthDate: Joi.date(),
    gender: Joi.string(),
    targetGender: Joi.string().alphanum(),
    lookingFor: Joi.string().alphanum(),
    photos: Joi.array().items(Joi.string()),
    interests: Joi.array().items(Joi.string().max(25)),
    socialsList: Joi.array().items(Joi.string().max(35)),
    bio: Joi.string().max(255),
})

const createProfileSchema = Joi.object<IProfileCreationClient, true, IProfileCreationClient>({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    location: Joi.array().items(Joi.number()).length(2).required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().required(),
    targetGender: Joi.string().alphanum().required(),
    lookingFor: Joi.string().alphanum().required(),
    photos: Joi.array().items(Joi.string()).required(),
    interests: Joi.array().items(Joi.string().max(25)).required(),
    socialsList: Joi.array().items(Joi.string().max(35)).required(),
    bio: Joi.string().max(255).required(),
    personality: Joi.array().items(Joi.number().min(0).max(100).precision(0)).length(10).required()
})

// ambition, confidence, patience, kindness, creativity, resposibility, optimism, courage, modesty, perseverance

export default {
    create,
    edit,
    getById,
    getByLocation,
    getBySuggestion
}