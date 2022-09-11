import { model, Schema } from "mongoose";
const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    secret: {
        type: String,
        required: true
    }
})

const User = model("User", schema)

export default User