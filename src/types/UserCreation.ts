import UserBase from "./UserBase"
/**
 * User on creation representation, object which comes from client
 */
export default interface UserCreation extends UserBase {
    secret: string
} 