import ProfileBase from "./ProfileBase"

type ProfileEdit = Omit<Partial<ProfileBase>, "location">

export default ProfileEdit