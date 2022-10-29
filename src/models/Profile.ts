import { model, Schema } from "mongoose";
import IProfileCreation from "../types/Profile/IProfileCreation";
import pointSchema from "./schemas/pointSchema";
const schema = new Schema<IProfileCreation>({
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
    gender: {
        type: String,
        required: true
    },
    targetGender: {
        type: String,
        required: true
    },
    lookingFor: {
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
    socialsList: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    personality: {
        type: [Number],
        required: true
    }
})

const Profile = model("Profile", schema)

export default Profile
