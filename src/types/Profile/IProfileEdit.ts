import IProfileBase from "./IProfileBase"

type IProfileEdit = Omit<Partial<IProfileBase>, "location">

export default IProfileEdit