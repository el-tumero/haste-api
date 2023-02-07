import ProfileBase from "./Profile/IProfileBase"

export type ResponseState = "done" | "error" | "notfound" | "unauthorized" | "conflict"

export interface ResponseExt {
    sessionToken?:string
    id?:string
    username?:string
    profile?: ProfileBase
    profiles?: ProfileBase[]
}

export interface ResponseMessage{
    state: ResponseState
    message: string
}

export interface ResponseMessageExtended extends ResponseMessage, ResponseExt {}



