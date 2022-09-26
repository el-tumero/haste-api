import User from "../models/User"
import ProfileCreation from "../types/ProfileCreation"
import * as grcp from "@grpc/grpc-js"
import { loadSync } from "@grpc/proto-loader"
import { ProtoGrpcType } from "../types/proto/match"
import path from "path"

const pkgDef = loadSync(path.resolve(__dirname, "../proto/match.proto"))
const proto = (grcp.loadPackageDefinition(pkgDef) as unknown) as ProtoGrpcType
const matchPackage = proto.matchPackage

const client = new matchPackage.Match("localhost:4000", grcp.credentials.createInsecure())


async function checkMatching(username1:string, username2:string){
    const users = await User.find({username: {$in: [username1, username2]}}).populate<{profile: ProfileCreation}>("profile", "personality -_id").select("profile -_id")

    const personalities = {
        first: users[0].profile.personality,
        second: users[1].profile.personality
    }
    
    client.getChance(personalities, (err, response) => {
        if(err) console.log(err)
        console.log(response)
    })

    // sending payload via grpc client to python tensorflow server


    return "request done"

}


export {
    checkMatching
}