import express from "express";
import { activateUser, deleteUser, getAllUsersAdmin, loginUser, logOutUser, registerUser, updateUserAvatar, updateUserPassword, updateUserRole } from "../controllers/userController";
import {getUserInfo, isAuthenticated, socialAuth, updateAccessToken, updateUserInfo, validateUserRole} from '../middlewares/auth'

export const userRouter = express.Router()

userRouter.post("/register",registerUser)

userRouter.post("/activate-user",activateUser)

userRouter.post("/login",loginUser)

userRouter.get("/logout", isAuthenticated ,logOutUser)

userRouter.get("/refresh-token", updateAccessToken)

userRouter.get("/me", updateAccessToken, isAuthenticated,getUserInfo)

userRouter.post("/social-auth",socialAuth)

userRouter.put("/update-user-info" ,updateAccessToken, isAuthenticated , updateUserInfo)

userRouter.put("/update-user-password" , updateAccessToken, isAuthenticated , updateUserPassword)

userRouter.put("/update-user-avatar" , updateAccessToken, isAuthenticated , updateUserAvatar)

userRouter.get("/get-all-users", isAuthenticated , validateUserRole("admin") , getAllUsersAdmin)

userRouter.put("/update-user-role/:id" ,updateAccessToken, isAuthenticated ,  validateUserRole("admin") , updateUserRole)

userRouter.delete("/delete-user/:id", isAuthenticated , validateUserRole("admin") , deleteUser)
