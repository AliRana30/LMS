"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const Order_1 = require("../models/Order");
exports.newOrder = (0, catchAsyncErrors_1.catchAsyncErrors)(async (data, res, next) => {
    const order = await Order_1.Order.create(data);
    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order
    });
});
//get all orders for admin
const getAllOrdersService = async (res) => {
    const orders = await Order_1.Order.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "Orders fetched Succefully",
        orders
    });
};
exports.getAllOrdersService = getAllOrdersService;
