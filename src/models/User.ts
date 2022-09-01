import { model, Schema } from "mongoose";
const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    names: String,
    surname: String,
    age:Number,
    key:String
})

const User = model("User", schema)

export default User