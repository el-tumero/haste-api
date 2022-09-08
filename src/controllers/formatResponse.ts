import {ResponseMessage, ResponseState, ResponseExt, ResponseMessageExtended} from "../types/ResponseMessage";

function formatResponse(state: ResponseState, message:string):ResponseMessage
function formatResponse(state: ResponseState, message:string, ext: ResponseExt):ResponseMessageExtended
function formatResponse(state:unknown, message:unknown, ext?:object):any{
    if(ext) return {
        state,
        message,
        ...ext
    }

    return {
        state,
        message
    }
}

export default formatResponse



    




