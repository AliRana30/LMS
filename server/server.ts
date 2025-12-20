import "dotenv/config";
import { app } from "./app";
import { connectDb } from "./utlis/db";
import cloudinary from 'cloudinary';
import http from "http";
import { initializeSocketServer } from "./socketServer";
const server = http.createServer(app);
// cloudinary config
cloudinary.v2.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
     secure: true,
   });

// use socket server  
initializeSocketServer(server)   

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDb()
});