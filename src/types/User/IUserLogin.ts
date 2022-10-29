import IUserBase from "./IUserBase";

export default interface IUserLogin extends IUserBase{
    password: string,
    uid: string
}