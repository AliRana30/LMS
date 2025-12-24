"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getAllUsersAdmin = exports.updateUserAvatar = exports.updateUserPassword = exports.createActivationToken = exports.logOutUser = exports.loginUser = exports.activateUser = exports.registerUser = void 0;
const errorHandler_1 = __importDefault(require("../utlis/errorHandler"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const sendMail_1 = require("../utlis/sendMail");
const jwt_1 = require("../utlis/jwt");
const redis_1 = __importDefault(require("../utlis/redis"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const userService_1 = require("../services/userService");
// register user
exports.registerUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { name, email, password, avatar } = req.body;
        console.log("Registration attempt for:", email);
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            console.log("User already exists:", email);
            return next(new errorHandler_1.default("User Already Exists", 409));
        }
        const user = {
            name,
            email,
            password,
            avatar,
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        console.log("Attempting to send activation email to:", user.email);
        try {
            await (0, sendMail_1.sendMail)({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });
            console.log("Activation email sent successfully to:", user.email);
            res.status(201).json({
                success: true,
                message: `Activation code sent to ${user.email}`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            console.error("Email sending error:", error);
            console.error("Error details:", error.message, error.stack);
            return next(new errorHandler_1.default(error.message, 500));
        }
    }
    catch (error) {
        console.error("Registration error:", error);
        console.error("Error details:", error.message, error.stack);
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// activate user
exports.activateUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    const { activation_code, activation_token } = req.body;
    // Validate input
    if (!activation_code || !activation_token) {
        return next(new errorHandler_1.default("Missing activation code or token", 400));
    }
    // Verify token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
    }
    catch (error) {
        console.error("JWT Verification Error:", error.message);
        if (error.name === "TokenExpiredError") {
            return next(new errorHandler_1.default("Activation token has expired", 400));
        }
        else if (error.name === "JsonWebTokenError") {
            return next(new errorHandler_1.default("Invalid activation token", 400));
        }
        else {
            return next(new errorHandler_1.default("Token verification failed", 400));
        }
    }
    // Check if the codes match (convert both to string for comparison)
    if (decoded.activationCode !== activation_code.toString()) {
        console.log("Code mismatch:", {
            expected: decoded.activationCode,
            received: activation_code
        });
        return next(new errorHandler_1.default("Invalid activation code", 400));
    }
    const { name, email, password, avatar } = decoded.user;
    // Check if user already exists
    const userExists = await User_1.User.findOne({ email });
    if (userExists) {
        return next(new errorHandler_1.default("User Already Exists", 409));
    }
    // Create user
    const user = await User_1.User.create({
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
});
//login user 
exports.loginUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_1.default("Please provide email and password", 400));
        }
        const user = await User_1.User.findOne({ email }).select("+password");
        if (!user) {
            return next(new errorHandler_1.default("Invalid email or password", 401));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new errorHandler_1.default("Invalid email or password", 401));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new errorHandler_1.default("Invalid email or password", 401));
    }
});
//logout User
exports.logOutUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const isProduction = process.env.NODE_ENV === 'production';
        // Cookie options must match the ones used when setting (especially sameSite)
        res.cookie("access_token", "", {
            maxAge: 1,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            path: "/"
        });
        res.cookie("refresh_token", "", {
            maxAge: 1,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            path: "/"
        });
        // Delete from Redis
        if (userId) {
            await redis_1.default.del(userId);
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error) {
        return next(new errorHandler_1.default("Unable to Logout", 400));
    }
});
//activation token
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({ user, activationCode }, process.env.ACTIVATION_SECRET, { expiresIn: "10m" });
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
// update user password
exports.updateUserPassword = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return next(new errorHandler_1.default("User not authenticated", 401));
        }
        if (newPassword == oldPassword) {
            return next(new errorHandler_1.default("New password must be different from old password", 400));
        }
        if (!oldPassword || !newPassword) {
            return next(new errorHandler_1.default("Please provide old and new password", 400));
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        // Check if user has a password (social auth users may not have one)
        if (user.password) {
            const isPasswordMatched = await user?.comparePassword(oldPassword);
            if (!isPasswordMatched) {
                return next(new errorHandler_1.default("Old password is incorrect", 400));
            }
        }
        user.password = newPassword;
        await user.save();
        await redis_1.default.set(userId, JSON.stringify(user));
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        console.log("Error updating password:", error.message);
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// update user avatar 
exports.updateUserAvatar = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return next(new errorHandler_1.default("User not authenticated", 401));
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        if (avatar && user) {
            // Check if user already has an avatar
            if (user?.avatar?.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(user.avatar.public_id);
            }
            // Upload new avatar
            const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        // Update Redis cache - convert ObjectId to string
        await redis_1.default.set(userId.toString(), JSON.stringify(user));
        await user.save();
        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            user
        });
    }
    catch (error) {
        console.error("Avatar update error:", error); // Add logging
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// get All Users -- only for admin
exports.getAllUsersAdmin = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        (0, userService_1.getAllUsersService)(res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// update user role -- only admin
exports.updateUserRole = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { id, role } = req.body;
        (0, userService_1.updateUserRoleService)(res, id, role);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// delete  a user -- only admin
exports.deleteUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            return next(new errorHandler_1.default("User Not found", 404));
        }
        await user.deleteOne({ id });
        await redis_1.default.del(id);
        res.status(200).json({
            success: true,
            message: "User deleted Succefully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 404));
    }
});
