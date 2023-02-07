import app from './app'
import mongoose from "mongoose";
import 'dotenv/config'

const PORT = Number(process.env.PORT)

// connecting to mongodb -> haste db
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to DB!"))
.catch(err => console.log(err))

app.listen(PORT, () => {
    console.log("Listening at http://localhost:"+PORT)
})