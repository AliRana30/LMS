"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const errorHandler_1 = __importDefault(require("../utlis/errorHandler"));
const Notification_1 = require("../models/Notification");
const node_cron_1 = __importDefault(require("node-cron"));
// get all notifications --only admin
exports.getNotifications = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const notifications = await Notification_1.Notification.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            notifications
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// update notification status --only admin
exports.updateNotification = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const notification = await Notification_1.Notification.findById(req.params.id);
        if (!notification) {
            return next(new errorHandler_1.default("Notification Not Found", 400));
        }
        else {
            notification?.status ? (notification.status = "read") : notification?.status;
        }
        await notification?.save();
        const notifications = await Notification_1.Notification.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Notification updated successfully",
            notifications
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// delete notification -- only admin -- after every 12 hours
node_cron_1.default.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    // delete after 30 days automatically only if the notification is read 
    await Notification_1.Notification.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } }); // lt means less than
});
