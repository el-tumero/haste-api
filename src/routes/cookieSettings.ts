import { CookieOptions } from "express"

const cookieSettings:CookieOptions = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 36000000),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
} 

export default cookieSettings 