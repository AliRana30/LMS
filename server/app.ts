import "dotenv/config"
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ErrorMiddleware } from './middlewares/error';
import { courseRouter } from './routes/courseRoutes';
import { orderRouter } from './routes/orderRoutes';
import { notificationRouter } from './routes/notificationRoutes';
import { analyticsRouter } from './routes/analyticsRoutes';
import { layoutRouter } from './routes/layoutRoutes';
import { userRouter } from "./routes/userRoutes";
import { rateLimit } from 'express-rate-limit'

export const app = express();

// body parser
app.use(express.json({limit: '50mb'}));

app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// api limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false,
	ipv6Subnet: 56,
})

app.get("/", (req : Request, res : Response,next : NextFunction) => {
  res.send("Server is Running!");
})

app.use("/api/v1", userRouter)
app.use("/api/v1",courseRouter)
app.use("/api/v1",orderRouter)
app.use("/api/v1",notificationRouter)
app.use("/api/v1",analyticsRouter)
app.use("/api/v1",layoutRouter)

// app.all("*", (req : Request, res : Response,next : NextFunction) => {
//   res.status(404).json({
//     success: false,
//     message: "Route Not Found",
//   });
// });

app.use(limiter)
app.use(ErrorMiddleware);