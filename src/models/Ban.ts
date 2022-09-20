import { model, Schema, Types } from "mongoose";

const schema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true 
    }
})

const Ban = model("Ban", schema)

export default Ban