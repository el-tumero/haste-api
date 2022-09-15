import { model, Schema } from "mongoose";
import ProfileBase from "../types/ProfileBase";
const schema = new Schema<ProfileBase>({
    firstName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        require: true 
    },
    localization: {
        type: String,
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
