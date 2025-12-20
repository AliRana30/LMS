import "dotenv/config";
import mongoose from "mongoose";            

const MONGO_URI:string = process.env.MONGO_URI || "";

export const connectDb = async()=>{
    try {
        mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        setTimeout(() => {
            connectDb();
        }, 5000);
    }
}
