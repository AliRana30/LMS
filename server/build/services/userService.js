"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const redis_1 = __importDefault(require("../utlis/redis"));
const User_1 = require("../models/User");
const getUserById = async (id, res) => {
    const userJson = await redis_1.default.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(200).json({
            success: true,
            user
        });
    }
};
exports.getUserById = getUserById;
//get all users for admin
const getAllUsersService = async (res) => {
    const users = await User_1.User.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "Users fetched Succefully",
        users
    });
};
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = async (res, id, role) => {
    const user = await User_1.User.findByIdAndUpdate(id, { role }, { new: true });
    // Update Redis cache
    if (user) {
        await redis_1.default.set(id, JSON.stringify(user));
    }
    res.status(200).json({
        success: true,
        message: "User's role updated Succefully",
        user
    });
};
exports.updateUserRoleService = updateUserRoleService;
