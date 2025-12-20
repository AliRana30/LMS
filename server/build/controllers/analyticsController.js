"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersAnalytics = exports.getCoursesAnalytics = exports.getUsersAnalytics = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const analyticsGenerator_1 = require("../utlis/analyticsGenerator");
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const Order_1 = require("../models/Order");
exports.getUsersAnalytics = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const users = await (0, analyticsGenerator_1.generateLast12MonthsData)(User_1.User);
        res.status(200).json({
            success: true,
            message: "12 months users report fetched successfully",
            users
        });
    }
    catch (error) {
    }
});
exports.getCoursesAnalytics = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const courses = await (0, analyticsGenerator_1.generateLast12MonthsData)(Course_1.Course);
        res.status(200).json({
            success: true,
            message: "12 months courses report fetched successfully",
            courses
        });
    }
    catch (error) {
    }
});
exports.getOrdersAnalytics = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const orders = await (0, analyticsGenerator_1.generateLast12MonthsData)(Order_1.Order);
        res.status(200).json({
            success: true,
            message: "12 months orders report fetched successfully",
            orders
        });
    }
    catch (error) {
    }
});
