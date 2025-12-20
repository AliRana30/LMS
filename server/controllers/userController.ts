import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utlis/errorHandler";
import { IUser, User } from "../models/User";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import path from "path";
import { sendMail } from "../utlis/sendMail";
import { sendToken } from "../utlis/jwt";
import redis from "../utlis/redis";
import cloudinary from "cloudinary";
import { getAllUsersService, updateUserRoleService } from "../services/userService";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

interface IActivationRequest {
  activation_code: string;
  activation_token: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}


// register user
export const registerUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar } = req.body as IRegistrationBody;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return next(new ErrorHandler("User Already Exists", 409));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
        avatar,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };

      const htmlPath = path.resolve(__dirname, "../mails/activation-mail.ejs");

      await ejs.renderFile(htmlPath, data);

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Activation code sent to ${user.email}`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// activate user
export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_code, activation_token } = req.body as IActivationRequest;

    // Validate input
    if (!activation_code || !activation_token) {
      return next(new ErrorHandler("Missing activation code or token", 400));
    }

    // Verify token
    let decoded: { user: IUser; activationCode: string };
    
    try {
      decoded = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as Secret
      ) as { user: IUser; activationCode: string };
    } catch (error: any) {
      console.error("JWT Verification Error:", error.message);
      
      if (error.name === "TokenExpiredError") {
        return next(new ErrorHandler("Activation token has expired", 400));
      } else if (error.name === "JsonWebTokenError") {
        return next(new ErrorHandler("Invalid activation token", 400));
      } else {
        return next(new ErrorHandler("Token verification failed", 400));
      }
    }

    // Check if the codes match (convert both to string for comparison)
    if (decoded.activationCode !== activation_code.toString()) {
      console.log("Code mismatch:", { 
        expected: decoded.activationCode, 
        received: activation_code 
      });
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password, avatar } = decoded.user;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("User Already Exists", 409));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      avatar
    });

    return res.status(201).json({
      success: true,
      message: "Account activated successfully",
      user,
    });
  }
);

//login user 
export const loginUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res);


  } catch (error) {
    return next(new ErrorHandler("Invalid email or password", 401))
  }
}
)

//logout User
export const logOutUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id
    
    res.cookie("access_token", "", {
      maxAge: 1,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.cookie("refresh_token", "", {
      maxAge: 1,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    // Delete from Redis
    if (userId) {
      await redis.del(userId as string);
    }
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    return next(new ErrorHandler("Unable to Logout", 400))
  }
})
//activation token
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();


  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "10m" }
  );

  return { token, activationCode };
};

// update user password
export const updateUserPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      if(newPassword == oldPassword){
        return next(new ErrorHandler("New password must be different from old password", 400));
      }

      if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please provide old and new password", 400));
      }

      const user = await User.findById(userId)
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const isPasswordMatched = await user?.comparePassword(oldPassword);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }

      user.password = newPassword;
      await user.save();
      await redis.set(userId as string , JSON.stringify(user) as any)


      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      console.log("Error updating password:", error.message);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user avatar 
export const updateUserAvatar = catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
     const {avatar} = req.body;
     const userId = req.user?._id;
     
     if(!userId){
        return next(new ErrorHandler("User not authenticated" , 401)) 
     }

     const user = await User.findById(userId); 

     if(!user){
        return next(new ErrorHandler("User not found" , 404))
     }

     if(avatar && user){
       // Check if user already has an avatar
       if(user?.avatar?.public_id){ 
         await cloudinary.v2.uploader.destroy(user.avatar.public_id)
       }
       
       // Upload new avatar
       const myCloud = await cloudinary.v2.uploader.upload(avatar,{
         folder:"avatars",
         width:150,
         crop:"scale"
       })
       
       user.avatar = {
         public_id: myCloud.public_id,
         url: myCloud.secure_url
       }
     }

     // Update Redis cache - convert ObjectId to string
     await redis.set(userId.toString(), JSON.stringify(user)) 

     await user.save()


     res.status(200).json({
        success:true,
        message:"Avatar updated successfully",
        user
     })
  }
  catch(error : any){
      console.error("Avatar update error:", error); // Add logging
      return next(new ErrorHandler(error.message , 400))
  }
})

// get All Users -- only for admin

export const getAllUsersAdmin =  catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
   try {
    getAllUsersService(res)
   } catch (error : any) {
      return next(new ErrorHandler(error.message , 400))
   }
})

// update user role -- only admin

export const updateUserRole =  catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
     const {id , role } = req.body;
     updateUserRoleService(res,id,role)
  } catch (error : any) {
       return next(new ErrorHandler(error.message , 400))
  }
})

// delete  a user -- only admin

export const deleteUser =  catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
     const {id} = req.params

     const user = await User.findById(id)

     if(!user){
       return next(new ErrorHandler("User Not found", 404))
     }

     await user.deleteOne({id})

     await redis.del(id)

      res.status(200).json({
        success : true,
        message : "User deleted Succefully",
    })

  } catch (error : any) {
       return next(new ErrorHandler(error.message ,  404))
    
  }
})
