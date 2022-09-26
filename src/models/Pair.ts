import { model, Schema, Types } from "mongoose";

const schema = new Schema({
    personality1: {
        type: [Number],
        required: true 
    },
    personality2: {
        type: [Number],
        required: true
    },
    match: {
        type: Boolean,
        required: true
    }
})

const Pair = model("Pair", schema)

export default Pair