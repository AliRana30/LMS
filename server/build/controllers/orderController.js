"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripePublishableKey = exports.getAllOrdersAdmin = exports.createOrder = void 0;
require('dotenv').config();
const sendMail_1 = require("../utlis/sendMail");
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const errorHandler_1 = __importDefault(require("../utlis/errorHandler"));
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const orderService_1 = require("../services/orderService");
const Notification_1 = require("../models/Notification");
const redis_1 = __importDefault(require("../utlis/redis"));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// create order
exports.createOrder = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        const userId = req.user?._id?.toString() || '';
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntent = await stripe.paymentIntents.retrieve(payment_info.id);
                if (paymentIntent.status !== "succeeded") {
                    return next(new errorHandler_1.default("Payment not successful", 400));
                }
            }
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return next(new errorHandler_1.default("User not found", 404));
        }
        const courseExists = user.courses?.find((course) => course._id.toString() === courseId.toString());
        if (courseExists) {
            return next(new errorHandler_1.default("You have already purchased this course", 400));
        }
        const course = await Course_1.Course.findById(courseId);
        if (!course) {
            return next(new errorHandler_1.default("Course doesn't exist", 400));
        }
        const data = {
            courseId: course._id,
            userId: user._id,
            payment_info
        };
        // Create the order
        const order = await Order_1.Order.create(data);
        const mailData = {
            order: {
                _id: order?._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            }
        };
        // Send email
        try {
            await (0, sendMail_1.sendMail)({
                email: user.email,
                subject: "Order Confirmation - CampusCore",
                template: "order-confirmation.ejs",
                data: mailData
            });
        }
        catch (error) {
            console.error("Email sending failed:", error.message);
        }
        // Add course to user's courses
        user.courses.push(course._id);
        await redis_1.default.set(userId, JSON.stringify(user));
        await user.save();
        // Create notification
        await Notification_1.Notification.create({
            user: user._id,
            title: "New Order",
            message: `${user.name} have successfully purchased ${course.name}`
        });
        course.purchased = (course.purchased || 0) + 1;
        await course.save();
        // FIXED: Send response directly and return
        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                _id: order._id,
                courseId: course._id,
                courseName: course.name,
                price: course.price,
                userId: user._id
            }
        });
    }
    catch (error) {
        console.error("Order creation error:", error);
        return next(new errorHandler_1.default(error.message, 500));
    }
});
// get all orders --only admin
exports.getAllOrdersAdmin = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        (0, orderService_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// send stripe publishable key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        res.status(200).json({
            success: true,
            publishableKey
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// new payment
exports.newPayment = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const payment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            metadata: { company: "CampusCore" },
            automatic_payment_methods: { enabled: true },
        });
        res.status(200).json({
            success: true,
            client_secret: payment.client_secret
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
