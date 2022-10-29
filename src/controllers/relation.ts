import User from "../models/User"
import ProfileCreation from "../types/Profile/IProfileCreation"
import * as grcp from "@grpc/grpc-js"
import { loadSync } from "@grpc/proto-loader"
import { ProtoGrpcType } from "../types/proto/suggestion"
import path from "path"


const pkgDef = loadSync(path.resolve(__dirname, "../proto/suggestion.proto"))
const proto = (grcp.loadPackageDefinition(pkgDef) as unknown) as ProtoGrpcType
const suggestionPackage = proto.suggestionPackage

const client = new suggestionPackage.Suggestion("localhost:4000", grcp.credentials.createInsecure())

type Personalities = {
    sender: number[]
    others: number[]
}

const grpcRequest = (personalities:Personalities) => new Promise<number[]>((resolve, reject) => {
    client.getChances(personalities, (err, response) => {
        if(err) reject(err)
        resolve(response.chances)
    })
})

// async function predictMatchingDebug(usernameSender:string, usernames:string[]){
//     const data = await User.find({username: {$in: [usernameSender, ...usernames]}}).populate<{profile: ProfileCreation}>("profile", "personality -_id").select("profile username -_id")
    
//     const sender = data.find(obj => obj.username === usernameSender)
//     const other = data.filter(obj => obj.username !== usernameSender)
    
//     const personalities:Personalities = {
//         sender: sender.profile.personality,
//         others: [].concat(...other.map(obj => obj.profile.personality))
//     }

//     // sending payload via grpc client to python tensorflow server
//     const response = await grpcRequest(personalities)
    
//     return response

// }

async function predictMatching(senderPersonality:number[], otherPersonalities:number[][]){

    const personalities:Personalities = {
        sender: senderPersonality,
        others: [].concat(...otherPersonalities)
    }

    //sending payload via grpc client to python tensorflow server
    const response = await grpcRequest(personalities)
    return response
}


export {
    predictMatching
}