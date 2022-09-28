import User from "../models/User"
import ProfileCreation from "../types/ProfileCreation"
import * as grcp from "@grpc/grpc-js"
import { loadSync } from "@grpc/proto-loader"
import { ProtoGrpcType } from "../types/proto/suggestion"
import path from "path"
import { number } from "joi"

const pkgDef = loadSync(path.resolve(__dirname, "../proto/suggestion.proto"))
const proto = (grcp.loadPackageDefinition(pkgDef) as unknown) as ProtoGrpcType
const suggestionPackage = proto.suggestionPackage

const client = new suggestionPackage.Suggestion("localhost:4000", grcp.credentials.createInsecure())

type Personalities = {
    first: number[]
    second: number[]
}

const grpcRequest = (personalities:Personalities) => new Promise<number>((resolve, reject) => {
    client.getChance(personalities, (err, response) => {
        if(err) reject(err)
        resolve(response.chance)
    })
})

async function predictMatching(username1:string, username2:string){
    const users = await User.find({username: {$in: [username1, username2]}}).populate<{profile: ProfileCreation}>("profile", "personality -_id").select("profile -_id")

    const personalities:Personalities = {
        first: users[0].profile.personality,
        second: users[1].profile.personality
    }

    //predict matching*


    // sending payload via grpc client to python tensorflow server
    const response = await grpcRequest(personalities)

    return response

}


export {
    predictMatching
}