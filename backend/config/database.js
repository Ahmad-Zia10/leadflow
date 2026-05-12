import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const uri = process.env.NODE_ENV === "docker"
            ? process.env.MONGODB_URI_DOCKER        // already has DB name
            : `${process.env.MONGODB_URI}${DB_NAME}`; // append DB name for Atlas

        const connectionInstance = await mongoose.connect(uri);
        console.log(`Mongo DB connected !! DB host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Database connection failed", error.message);
        process.exit(1);
    }
}

export default connectDB;