import IProfileBase from "./IProfileBase";
export default interface IProfileCreation extends IProfileBase {
    location: {
        type: "Point",
        coordinates: [number, number]
    }
    personality:number[]
}