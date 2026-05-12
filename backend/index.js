import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("Mongo DB connecction error",err);
    
})
