import app from './app'
import mongoose from "mongoose";
import 'dotenv/config'

// const PORT = Number(process.env.PORT)
const PORT = 3000
// connecting to mongodb -> haste db
// mongoose.connect(process.env.MONGO_URI)
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2process.env.MONGO_URI")
.then(() => console.log("Connected to DB!"))
.catch(err => console.log(err))

app.listen(PORT, () => {
    console.log("Listening at http://localhost:"+PORT)
})


