"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const orderController_1 = require("../controllers/orderController");
exports.orderRouter = express_1.default.Router();
exports.orderRouter.post("/create-order", auth_1.updateAccessToken, auth_1.isAuthenticated, orderController_1.createOrder);
exports.orderRouter.get("/get-all-orders", auth_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.validateUserRole)("admin"), orderController_1.getAllOrdersAdmin);
exports.orderRouter.get("/payment/stripe-publishable-key", auth_1.updateAccessToken, auth_1.isAuthenticated, orderController_1.sendStripePublishableKey);
// new payment
exports.orderRouter.post("/payment/new-payment", auth_1.updateAccessToken, auth_1.isAuthenticated, orderController_1.newPayment);
