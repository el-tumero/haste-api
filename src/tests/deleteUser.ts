import User from "../models/User";
import Profile from "../models/Profile";
import { UserTest } from "./createUser";

export default function deleteUser(user:UserTest, next: () => void){
    User.findOneAndDelete({username: user.username}, (err:Error, doc:any) => {
        if(doc){
          Profile.deleteOne({_id: doc.profile}).then(() => next())
        }
    })
}