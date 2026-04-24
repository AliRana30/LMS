import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });
import { Redis } from "ioredis";

const getRedisUrl = () => {
  const uri = process.env.REDIS_URI;
  if (uri) {
    return uri.trim();
  }
  throw new Error("Redis connection failed: Missing URI");
};

const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: null,
  family: 4,
  tls: {
    rejectUnauthorized: false
  }
});

redis.on("connect", () => {
  console.log("Redis connecting...");
});

redis.on("ready", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export default redis;