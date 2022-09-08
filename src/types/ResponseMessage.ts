
export type ResponseState = "done" | "error"

export interface ResponseExt {
    sessionToken?:string
    id?:string
}

export interface ResponseMessage{
    state: ResponseState
    message: string
}

export interface ResponseMessageExtended extends ResponseMessage, ResponseExt {}



