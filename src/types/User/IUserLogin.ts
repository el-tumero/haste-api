import IUserBase from "./IUserBase";

export default interface IUserLogin extends IUserBase{
    phone: string
    code: string
    uid: string
}