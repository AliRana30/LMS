import "dotenv/config";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const emailRegex : RegExp= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
    name : string;
    email : string;
    password : string;
    avatar : {
        public_id : string;
        url : string;
    }
    role : string;
    isVerified : boolean;
    courses : Array<{courseId : string}>;
    SignAccessToken : () => string;
    SignRefreshToken : () => string;
    createdAt : Date;
    updatedAt : Date;
    comparePassword(password : string) : Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name : {
        type : String,
        required : [true, "Name is required"],
        maxLength : [50, "Name must be less than 50 characters"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        validate : {
            validator : (value : string) => emailRegex.test(value), 
            message : "Please enter a valid email"  
        }
    },
    password : {        
        type : String,
        minLength : [6, "Password must be at least 6 characters"],      
        select : true
    },
    avatar : {
        public_id : {
            type : String,
            required : false             
        },
        url : {
            type : String,
            required : false 
        }
    },
    role : {
        type : String,
        enum : ["user", "instructor", "admin"],
        default : "user"    
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    courses : [ 
        {courseId : String}
    ]
}, {timestamps : true});

//hash password before saving
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//sign access token
userSchema.methods.SignAccessToken = function() : string{
    return jwt.sign({id:this._id},process.env.ACCESS_TOKEN as string, {expiresIn : "15m"});
}

//sign refresh token
userSchema.methods.SignRefreshToken = function() : string{
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN as string, {expiresIn : "3d"});
}

//compare password
userSchema.methods.comparePassword = async function(password : string) : Promise<boolean>{
    return await bcrypt.compare(password, this.password);
}   

export const User = mongoose.model("User", userSchema);