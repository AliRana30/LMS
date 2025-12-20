import "dotenv/config";
import {Redis} from "ioredis";

const REDIS_URI:string = process.env.REDIS_URI || "";

const redisClient = ()=>{
   if(REDIS_URI){
      console.log("Redis connected successfully");
      return REDIS_URI;
   }
   throw new Error("Redis connection failed");
}

const redis = new Redis(redisClient()); 
export default redis;