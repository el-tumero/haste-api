import { model, Schema } from "mongoose";
import ProfileBase from "../types/ProfileBase";
const schema = new Schema<ProfileBase>({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: false
    },
    surname: {
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
    }
})

const Profile = model("Profile", schema)

export default Profile