import express from "express"
import { isAuthenticated, validateUserRole } from "../middlewares/auth"
import { getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analyticsController"

export const analyticsRouter = express.Router()

analyticsRouter.get("/get-users-analytics" , isAuthenticated , validateUserRole("admin") , getUsersAnalytics)

analyticsRouter.get("/get-courses-analytics" , isAuthenticated , validateUserRole("admin") , getCoursesAnalytics)

analyticsRouter.get("/get-orders-analytics" , isAuthenticated , validateUserRole("admin") , getOrdersAnalytics)

