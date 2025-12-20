"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.validateUserRole = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = __importDefault(require("../utlis/errorHandler"));
const redis_1 = __importDefault(require("../utlis/redis"));
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const jwt_1 = require("../utlis/jwt");
const userService_1 = require("../services/userService");
const User_1 = require("../models/User");
//authenticate user
const isAuthenticated = async (req, res, next) => {
    try {
        const access_token = req.cookies.access_token;
        if (!access_token) {
            return next(new errorHandler_1.default("Login first to access this resource", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
        if (!decoded || !decoded.id) {
            return next(new errorHandler_1.default("Invalid or expired token", 400));
        }
        // Fetch user from Redis using decoded.id
        const user = await redis_1.default.get(decoded.id);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        req.user = JSON.parse(user);
        next();
    }
    catch (error) {
        console.error("Auth Error:", error);
        return next(new errorHandler_1.default("Unauthorized", 401));
    }
};
exports.isAuthenticated = isAuthenticated;
//validate user role
const validateUserRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new errorHandler_1.default(`User with role ${req.user?.role} is not authorized to access this resource`, 403));
        }
        next();
    };
};
exports.validateUserRole = validateUserRole;
// update refresh token 
exports.updateAccessToken = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new errorHandler_1.default("Please login to access this resource", 401));
        }
        // Verify the refresh token
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        if (!decoded) {
            return next(new errorHandler_1.default("Could not refresh token", 400));
        }
        // Get user from Redis first (faster)
        const session = await redis_1.default.get(decoded.id);
        if (!session) {
            return next(new errorHandler_1.default("Please login to access this resource", 401));
        }
        const user = JSON.parse(session);
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "5h" });
        // Generate new refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.default.set(user._id, JSON.stringify(user), 'EX', 7 * 24 * 60 * 60); // 7 days expiry
        next();
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
// get user info
exports.getUserInfo = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        (0, userService_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new errorHandler_1.default("Unable to fetch user data", 400));
    }
});
// social auth
exports.socialAuth = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        // Validate required fields
        if (!email) {
            return next(new errorHandler_1.default("Email is required", 400));
        }
        // Check if user exists
        let user = await User_1.User.findOne({ email });
        if (!user) {
            // Create new user if doesn't exist
            user = await User_1.User.create({
                email,
                name: name || email.split('@')[0],
                avatar: avatar ? {
                    public_id: '',
                    url: avatar
                } : undefined,
                password: Math.random().toString(36).slice(-8),
            });
        }
        else {
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
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
});
// update user info
exports.updateUserInfo = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { name } = req.body;
        const user = await User_1.User.findById(userId);
        if (name && user) {
            user.name = name;
        }
        await redis_1.default.set(userId, JSON.stringify(user));
        await user?.save();
        res.status(200).json({
            success: true,
            message: "User info updated successfully",
            user
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
