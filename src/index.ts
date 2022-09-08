import express from "express";
import routes from "./routes/routes";
import mongoose from "mongoose";
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser";
import verification from "./middlewares/verification";

const PORT = process.env.PORT

// connecting to mongodb -> haste db
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to DB!"))
.catch(err => console.log(err))

const app = express()

app.use(express.json())
app.use(cors({
    origin : "http://localhost:1234",
    credentials: true
}))
app.use(cookieParser())

app.use("/user", routes.user)

app.get("/", (req, res) => {
    res.send("haste-api")
})

app.get("/test-cookies", (req, res) => {
    res.json({
        cookies: req.cookies
    })
})

app.get("/account-test", verification, (req, res) => {
    // create type for req.cookies.[...]
    // console.log(req.cookies)
    res.status(200)
    res.json({message: "You are authorized!"})
})


app.listen(3000, () => {
    console.log("Listening at http://localhost:"+PORT)
})


