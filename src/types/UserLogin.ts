import UserBase from "./UserBase";

/**
 * User on login representation, object which comes from client
 */
export default interface UserLogin extends UserBase{
    password: string,
    token: string
}