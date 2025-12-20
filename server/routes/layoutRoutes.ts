import express from "express"
import { isAuthenticated, updateAccessToken, validateUserRole } from "../middlewares/auth"
import { createLayout, editLayout, getLayoutByType } from "../controllers/layoutController"

export const layoutRouter = express.Router()

layoutRouter.post("/create-layout" ,updateAccessToken, isAuthenticated , validateUserRole("admin") , createLayout)

layoutRouter.put("/edit-layout" ,updateAccessToken, isAuthenticated , validateUserRole("admin") , editLayout)

layoutRouter.get("/get-layout/:type" , getLayoutByType)


