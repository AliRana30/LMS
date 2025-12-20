import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { generateLast12MonthsData } from "../utlis/analyticsGenerator";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { Order } from "../models/Order";


export const getUsersAnalytics = catchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
     try {
        const users = await generateLast12MonthsData(User);

        res.status(200).json({
            success : true,
            message : "12 months users report fetched successfully",
            users
        })
        
     } catch (error) {
        
     }
})

export const getCoursesAnalytics = catchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
     try {
        const courses = await generateLast12MonthsData(Course);

        res.status(200).json({
            success : true,
            message : "12 months courses report fetched successfully",
            courses
        })
        
     } catch (error) {
        
     }
})


export const getOrdersAnalytics = catchAsyncErrors(async(req: Request, res: Response, next: NextFunction) => {
     try {
        const orders = await generateLast12MonthsData(Order);

        res.status(200).json({
            success : true,
            message : "12 months orders report fetched successfully",
            orders
        })
        
     } catch (error) {
        
     }
})