import { model, Schema } from "mongoose";
import ProfileBase from "../types/ProfileBase";
import pointSchema from "./schemas/pointSchema";
const schema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        require: true 
    },
    location: {
        type: pointSchema,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    intimacy: {
        type: String,
        required: true
    },
    photos: {
        type: [String],
        required: true
    },
    interests: {
        type: [String],
        required: true
    },
    socials: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
        required: true
    }

})

const Profile = model("Profile", schema)

export default Profile
