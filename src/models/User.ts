import { model, Schema, Types } from "mongoose";

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    profile: {
        type: Types.ObjectId,
        ref: "Profile",
        required: false
    },
    uid: {
        type: [String]
    },
    banned: {
        type: Boolean
    }

})

const User = model("User", schema)

export default User