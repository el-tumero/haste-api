import ProfileBase from "./ProfileBase";

export default interface ProfileCreation extends ProfileBase {
    location: {
        type: "Point",
        coordinates: [number, number]
    }
    personality:number[]
}