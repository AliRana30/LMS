"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_1 = require("./middlewares/error");
const courseRoutes_1 = require("./routes/courseRoutes");
const orderRoutes_1 = require("./routes/orderRoutes");
const notificationRoutes_1 = require("./routes/notificationRoutes");
const analyticsRoutes_1 = require("./routes/analyticsRoutes");
const layoutRoutes_1 = require("./routes/layoutRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const express_rate_limit_1 = require("express-rate-limit");
exports.app = (0, express_1.default)();
// body parser
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use((0, cookie_parser_1.default)());
console.log("CORS Origin configured:", process.env.ORIGIN);
exports.app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// api limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.app.get("/", (req, res, next) => {
    res.send("Server is Running!");
});
exports.app.use("/api/v1", userRoutes_1.userRouter);
exports.app.use("/api/v1", courseRoutes_1.courseRouter);
exports.app.use("/api/v1", orderRoutes_1.orderRouter);
exports.app.use("/api/v1", notificationRoutes_1.notificationRouter);
exports.app.use("/api/v1", analyticsRoutes_1.analyticsRouter);
exports.app.use("/api/v1", layoutRoutes_1.layoutRouter);
// app.all("*", (req : Request, res : Response,next : NextFunction) => {
//   res.status(404).json({
//     success: false,
//     message: "Route Not Found",
//   });
// });
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
