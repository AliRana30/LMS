import express from "express";
import { isAuthenticated, updateAccessToken, validateUserRole } from "../middlewares/auth";
import { getNotifications, updateNotification } from "../controllers/notificationController";

export const notificationRouter = express.Router()

notificationRouter.get("/get-all-notifications" ,updateAccessToken, isAuthenticated, validateUserRole("admin") , getNotifications) 

notificationRouter.put("/update-notification/:id" ,updateAccessToken, isAuthenticated, validateUserRole("admin") , updateNotification) 
