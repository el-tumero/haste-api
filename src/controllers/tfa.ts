import User from "../models/User"
import formatResponse from "./formatResponse"
import jwt from 'jsonwebtoken'
const codesDatabase:{[key:string]: string} = {}

function generateCode(phone:string){
    const code = Math.floor(Math.random() * (9999 - 1000) + 1000) 
    codesDatabase[phone] = code.toString()
    return formatResponse("done", "Code generated!") 
}

function displayCode(phone:any){
    if(typeof phone !== "string") return formatResponse("conflict", "Given value is not a phone number")

    if(codesDatabase[phone]) return formatResponse("done", codesDatabase[phone])

    return formatResponse("notfound", "No code found for given number!")
}

function deleteCode(phone: string){
    delete codesDatabase[phone]
}

async function activate(phone:string, code:string){

    const validator = new RegExp(/^[0-9]+$/)

    if(!validator.test(phone) || !validator.test(code) || phone.length !== 9 && code.length !== 4) return formatResponse("conflict", "Wrong type of phone number or code!")

    try {
        if(code !== codesDatabase[phone]) return formatResponse("conflict", "Wrong auth code!")
        delete codesDatabase[phone]
        const updatedUser = await User.findOneAndUpdate({phone}, {activated: true})
        const sessionToken = jwt.sign({id: updatedUser.id}, process.env.PRIVATE_KEY, {expiresIn: '10h'})
        return formatResponse("done", "Account activated!", {sessionToken})
        // return formatResponse("done", "Account activated!")

    } catch (error) {
        return formatResponse("error", "Server error")
    }
}

export default {
    generateCode,
    displayCode,
    deleteCode,
    activate
}

