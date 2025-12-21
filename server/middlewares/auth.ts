import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ErrorHandler from "../utlis/errorHandler";
import redis from "../utlis/redis";
import { catchAsyncErrors } from "./catchAsyncErrors";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utlis/jwt";
import { getUserById } from "../services/userService";
import { User } from "../models/User";

interface DecodedToken extends JwtPayload {
  id: string;
}

interface ISocialAuthBody{
    email : string;
    name : string;
    avatar : string;
}

interface IUpdateUserInfo{
     email : string;
     name : string;
}

//authenticate user
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Auth check - Cookies:", Object.keys(req.cookies));
    console.log("Auth check - Access Token:", req.cookies.access_token ? "present" : "missing");
    
    const access_token = req.cookies.access_token;

    if (!access_token) {
      console.log("Auth failed: No access token in cookies");
      return next(new ErrorHandler("Login first to access this resource", 401));
    }

    const decoded = jwt.verify(
      access_token as string,
      process.env.ACCESS_TOKEN as string
    ) as DecodedToken;

    if (!decoded || !decoded.id) {
      console.log("Auth failed: Invalid token decode");
      return next(new ErrorHandler("Invalid or expired token", 400));
    }

    console.log("Auth check - User ID from token:", decoded.id);

    // Fetch user from Redis using decoded.id
    const user = await redis.get(decoded.id);
    if (!user) {
      console.log("Auth failed: User not found in Redis for ID:", decoded.id);
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = JSON.parse(user);
    console.log("Auth success - User role:", req.user?.role);
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return next(new ErrorHandler("Unauthorized", 401));
  }
};

//validate user role
export const validateUserRole = (...roles: string[]) => {
   return (req : Request, res:Response, next:NextFunction) => {
     if (!roles.includes(req.user?.role as string)) {
       return next(new ErrorHandler(`User with role ${req.user?.role} is not authorized to access this resource`, 403));
     }
     next();
  }
}

// update refresh token 
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
      }

      // Verify the refresh token
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as Secret
      ) as { id: string };

      if (!decoded) {
        return next(new ErrorHandler("Could not refresh token", 400));
      }

      // Get user from Redis first (faster)
      const session = await redis.get(decoded.id);

      if (!session) {
        return next(new ErrorHandler("Please login to access this resource", 401));
      }

      const user = JSON.parse(session);

      // Generate new access token
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as Secret,
        { expiresIn: "5h" }
      );

      // Generate new refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as Secret,
        { expiresIn: "7d" }
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id as string, JSON.stringify(user), 'EX', 7 * 24 * 60 * 60); // 7 days expiry

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get user info
export const getUserInfo = catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
   try {
      const userId = req.user?._id  
      getUserById(userId as string , res)
   }
    catch (error) {
       return next(new ErrorHandler("Unable to fetch user data" , 400))
    }
  })

// social auth
export const socialAuth = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;

      // Validate required fields
      if (!email) {
        return next(new ErrorHandler("Email is required", 400));
      }

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        
        // Create new user if doesn't exist
        user = await User.create({
          email,
          name: name || email.split('@')[0],
          avatar: avatar ? {
            public_id: '',
            url: avatar
          } : undefined,
          password: Math.random().toString(36).slice(-8), 
        });
      } else {
        
        // Update user info if changed
        let hasChanges = false;
        
        if (name && user.name !== name) {
          user.name = name;
          hasChanges = true;
        }
        
        if (avatar && (!user.avatar || user.avatar.url !== avatar)) {
          user.avatar = {
            public_id: '',
            url: avatar
          };
          hasChanges = true;
        }
        
        if (hasChanges) {
          await user.save();
        }
      }
      
      // Send token (uses your existing sendToken function)
      sendToken(user, 200, res);

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update user info
export const updateUserInfo = catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
     const userId = req.user?._id
     const { name } = req.body as IUpdateUserInfo
     const user = await User.findById(userId)

     if(name && user){
        user.name = name;
     }

     await redis.set(userId as string , JSON.stringify(user) )

     await user?.save()
   
      res.status(200).json({
         success:true,
         message:"User info updated successfully",
         user
      })
  } catch (error : any) {
     return next(new ErrorHandler(error.message , 400)) 
  }
})