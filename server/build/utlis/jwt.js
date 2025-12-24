"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = exports.refreshTokenExpire = exports.accessTokenExpire = void 0;
require("dotenv/config");
const redis_1 = __importDefault(require("./redis"));
const isProduction = process.env.NODE_ENV === "production";
exports.accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "15"); // 15 minutes
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "7"); // 7 days
// Cookie options - configured for production cross-origin or development
exports.accessTokenOptions = {
    expires: new Date(Date.now() + exports.accessTokenExpire * 60 * 60 * 1000),
    maxAge: exports.accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + exports.refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: exports.refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
};
const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    // upload session to redis
    redis_1.default.set(user.id, JSON.stringify(user));
    console.log("Setting cookies with options:", {
        isProduction,
        sameSite: exports.accessTokenOptions.sameSite,
        secure: exports.accessTokenOptions.secure
    });
    // Set cookies (options already configured for production/development at module level)
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    // Send response
    res.status(statusCode).json({
        success: true,
        accessToken,
        user,
    });
};
exports.sendToken = sendToken;
