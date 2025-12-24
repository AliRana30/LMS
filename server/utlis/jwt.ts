import "dotenv/config";
import { Response } from "express";
import { IUser } from "../models/User";
import redis from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  secure?: boolean;
  sameSite: "lax" | "strict" | "none";
  path?: string;
}

const isProduction = process.env.NODE_ENV === "production";

export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "15"); // 15 minutes
export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "7"); // 7 days

// Cookie options - configured for production cross-origin or development
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  path: "/",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  path: "/",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user.id, JSON.stringify(user) as any);

  console.log("Setting cookies with options:", {
    isProduction,
    sameSite: accessTokenOptions.sameSite,
    secure: accessTokenOptions.secure
  });

  // Set cookies (options already configured for production/development at module level)
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  // Send response
  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};
