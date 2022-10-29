import IProfileBase from "./IProfileBase"
export default interface IProfileCreationClient extends IProfileBase{
    location: [number, number]
    personality:number[]
}