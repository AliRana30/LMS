import { NextFunction, Response } from "express"
import redis from "../utlis/redis"
import { Course } from "../models/Course"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors"

export const createCourse = catchAsyncErrors(async(data : string , res : Response , next : NextFunction) => {
      const course = await Course.create(data)
      res.status(201).json({
         success : true,
         message : "Course created Successfully",
         course
      })
})

//get all courses for admin

export const getAllCoursesService = async(res : Response)=>{
    const courses = await Course.find().sort({createdAt : -1})

    res.status(200).json({
        success : true,
        message : "Courses fetched Succefully",
        courses
    })
}