import IUserBase from "./IUserBase"
import { PopulatedDoc } from "mongoose"
import IProfileCreation from "../Profile/IProfileCreation"

export default interface IUserCreation extends IUserBase {
    activated: boolean
    uid?: string[]
    profile?: PopulatedDoc<IProfileCreation>
} 