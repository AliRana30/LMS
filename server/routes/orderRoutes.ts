

import express from "express";
import { isAuthenticated, updateAccessToken, validateUserRole } from "../middlewares/auth";
import { createOrder, getAllOrdersAdmin, newPayment, sendStripePublishableKey } from "../controllers/orderController";

export const orderRouter = express.Router()

orderRouter.post("/create-order", updateAccessToken, isAuthenticated, createOrder)

orderRouter.get("/get-all-orders", updateAccessToken, isAuthenticated, validateUserRole("admin"), getAllOrdersAdmin)

orderRouter.get("/payment/stripe-publishable-key", updateAccessToken, isAuthenticated, sendStripePublishableKey)
// new payment
orderRouter.post("/payment/new-payment", updateAccessToken, isAuthenticated, newPayment)