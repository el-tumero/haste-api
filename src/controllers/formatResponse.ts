import {ResponseMessage, ResponseState, ResponseExt, ResponseMessageExtended} from "../types/ResponseMessage";

function formatResponse(state: ResponseState, message:string):ResponseMessage
function formatResponse(state: ResponseState, message:string, ext: ResponseExt):ResponseMessageExtended
function formatResponse(arg1:unknown, arg2:unknown, arg3?:object):any{
    if(arg3) return {
        arg1,
        arg2,
        ...arg3
    }

    return {
        arg1,
        arg2
    }
}

export default formatResponse



    




