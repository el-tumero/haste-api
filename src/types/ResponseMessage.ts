
export type ResponseState = "done" | "error" | "notfound" | "unauthorized" | "conflict"

export interface ResponseExt {
    sessionToken?:string
    id?:string
    username?:string
}

export interface ResponseMessage{
    state: ResponseState
    message: string
}

export interface ResponseMessageExtended extends ResponseMessage, ResponseExt {}



