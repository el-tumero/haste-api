import User from "../models/User";
import Profile from "../models/Profile";
import { UserTest } from "./createUser";

export default async function deleteUser(user:UserTest){
    const doc = await User.findOneAndDelete({phone: user.phone})
    if(doc) {
      await Profile.deleteOne({_id: doc.profile})
    }
  
}