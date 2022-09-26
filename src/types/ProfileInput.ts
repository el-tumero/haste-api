import ProfileBase from "./ProfileBase"
export default interface ProfileInput extends ProfileBase{
    location: [number, number]
    personality:number[]
}