"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "";
const connectDb = async () => {
    try {
        mongoose_1.default.connect(MONGO_URI);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        setTimeout(() => {
            (0, exports.connectDb)();
        }, 5000);
    }
};
exports.connectDb = connectDb;
