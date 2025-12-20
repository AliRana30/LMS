"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ioredis_1 = require("ioredis");
const REDIS_URI = process.env.REDIS_URI || "";
const redisClient = () => {
    if (REDIS_URI) {
        console.log("Redis connected successfully");
        return REDIS_URI;
    }
    throw new Error("Redis connection failed");
};
const redis = new ioredis_1.Redis(redisClient());
exports.default = redis;
