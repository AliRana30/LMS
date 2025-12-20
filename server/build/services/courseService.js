"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCoursesService = exports.createCourse = void 0;
const Course_1 = require("../models/Course");
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
exports.createCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async (data, res, next) => {
    const course = await Course_1.Course.create(data);
    res.status(201).json({
        success: true,
        message: "Course created Successfully",
        course
    });
});
//get all courses for admin
const getAllCoursesService = async (res) => {
    const courses = await Course_1.Course.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "Courses fetched Succefully",
        courses
    });
};
exports.getAllCoursesService = getAllCoursesService;
