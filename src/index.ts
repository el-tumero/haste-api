import express from "express";
import routes from "./routes/routes";
import mongoose from "mongoose";
import cors from "cors"

const PORT = 3000

// connecting to local mongodb -> haste db
mongoose.connect('mongodb://localhost/haste')

const app = express()

app.use(express.json())
app.use(cors())

app.use("/user", routes.user)

app.listen(3000, () => {
    console.log("Listening at http://localhost:"+PORT)
})


