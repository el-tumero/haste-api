import { model, Schema, Types } from "mongoose";
import IUserCreation from "../types/User/IUserCreation";

const schema = new Schema<IUserCreation>({
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: true
    },
    uid: {
        type: [String]
    },
    profile: {
        type: Types.ObjectId,
        ref: "Profile",
    },
})

const User = model("User", schema)

export default User