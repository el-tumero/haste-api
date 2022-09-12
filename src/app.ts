import express from "express";
import routes from "./routes/routes";
import cors from "cors"
import cookieParser from "cookie-parser";
import verification from "./middlewares/verification";

const app = express()

app.use(express.json())
app.use(cors({
    origin : ["http://localhost:1234", "http://localhost:19006"],
    credentials: true
}))
app.use(cookieParser())

app.use("/user", routes.user)

app.use("/profile", routes.profile)

app.get("/", (req, res) => {
    res.send("haste-api")
})

app.get("/test-cookies", (req, res) => {
    res.json({
        cookies: req.cookies
    })
})

app.get("/account-test", verification, (req, res) => {
    res.status(200)
    res.json({message: "You are authorized!"})
})

export default app