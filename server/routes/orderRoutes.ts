

import express  from "express";
import { isAuthenticated, validateUserRole } from "../middlewares/auth";
import { createOrder, getAllOrdersAdmin, newPayment, sendStripePublishableKey } from "../controllers/orderController";

export const orderRouter = express.Router()

orderRouter.post("/create-order" , isAuthenticated , createOrder)

orderRouter.get("/get-all-orders" , isAuthenticated , validateUserRole("admin") , getAllOrdersAdmin )

orderRouter.get("/payment/stripe-publishable-key" , isAuthenticated , sendStripePublishableKey)
// new payment
orderRouter.post("/payment/new-payment" , isAuthenticated , newPayment)