"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const db_1 = require("./utlis/db");
const cloudinary_1 = __importDefault(require("cloudinary"));
const http_1 = __importDefault(require("http"));
const socketServer_1 = require("./socketServer");
const server = http_1.default.createServer(app_1.app);
// cloudinary config
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
// use socket server  
(0, socketServer_1.initializeSocketServer)(server);
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    (0, db_1.connectDb)();
});
