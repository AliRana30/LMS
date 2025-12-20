"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.getAllCoursesAdmin = exports.generateVideoUrl = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseContent = exports.getCourseByUser = exports.getAllCourses = exports.getAllUserEnrolledCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middlewares/catchAsyncErrors");
const cloudinary_1 = __importDefault(require("cloudinary"));
const errorHandler_1 = __importDefault(require("../utlis/errorHandler"));
const courseService_1 = require("../services/courseService");
const Course_1 = require("../models/Course");
const redis_1 = __importDefault(require("../utlis/redis"));
const mongoose_1 = __importDefault(require("mongoose"));
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const sendMail_1 = require("../utlis/sendMail");
const Notification_1 = require("../models/Notification");
const vdoCipherAxios = axios_1.default.create({
    httpsAgent: new https_1.default.Agent({
        rejectUnauthorized: true,
        servername: 'dev.vdocipher.com',
    })
});
// upload course
exports.uploadCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { data } = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            // Upload thumbnail to cloudinary
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        (0, courseService_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// edit course
exports.editCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;
        const courseData = await Course_1.Course.findById(courseId);
        if (thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary_1.default.v2.uploader.destroy(thumbnail.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "Courses"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData?.thumbnail.public_id,
                url: courseData?.thumbnail.url
            };
        }
        const course = await Course_1.Course.findByIdAndUpdate(courseId, {
            $set: data
        }, {
            new: true
        });
        res.status(201).json({
            success: true,
            message: "Course updated successfully",
            course
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// get single course
exports.getSingleCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await Course_1.Course.findById(courseId)
            .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
            .populate('reviews.user', 'name avatar role');
        await redis_1.default.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// Backend - courseController.ts
exports.getAllUserEnrolledCourses = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const userCourseIds = req.user?.courses || [];
        if (userCourseIds.length === 0) {
            return res.status(200).json({
                success: true,
                courses: []
            });
        }
        const courseIds = userCourseIds.map((course) => course._id);
        // Fetch all enrolled courses
        const courses = await Course_1.Course.find({
            _id: { $in: courseIds }
        }).select('name description thumbnail ratings purchased categories level');
        res.status(200).json({
            success: true,
            courses
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// get all courses - without purchasing 
exports.getAllCourses = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const courses = await Course_1.Course.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// get course - only valid users
exports.getCourseByUser = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const userCourses = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourses?.find((course) => course._id.toString() === courseId);
        if (!courseExists) {
            return next(new errorHandler_1.default("You are not eligible to access this course", 403));
        }
        const course = await Course_1.Course.findById(courseId);
        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            courseExists
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
exports.getCourseContent = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course_1.Course.findById(id);
        if (!course)
            return res.status(404).json({ message: "Course not found" });
        res.status(200).json({
            success: true,
            content: course.courseData,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// add question on a specific course
exports.addQuestion = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { question, contentId, courseId } = req.body;
        const course = await Course_1.Course.findById(courseId);
        if (!course) {
            return next(new errorHandler_1.default("Course not found", 404));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new errorHandler_1.default("Invalid content id", 400));
        }
        const courseContent = course?.courseData?.find((item) => {
            return item._id.equals(contentId);
        });
        if (!courseContent) {
            return next(new errorHandler_1.default("Content not found", 404));
        }
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);
        await Notification_1.Notification.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent.title} from ${req.user?.name}`
        });
        await course.save();
        res.status(200).json({
            success: true,
            message: "Question added successfully",
            course
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// add answer to specific question in a course
exports.addAnswer = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { answer, contentId, courseId, questionId } = req.body;
        const userId = req.user?._id;
        const course = await Course_1.Course.findById(courseId);
        if (!course) {
            return next(new errorHandler_1.default("Course not found", 404));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new errorHandler_1.default("Invalid content id", 400));
        }
        const courseContent = course?.courseData?.find((item) => {
            return item._id.equals(contentId);
        });
        if (!courseContent) {
            return next(new errorHandler_1.default("Content not found", 404));
        }
        const question = courseContent?.questions?.find((item) => item._id.toString() === questionId);
        if (!question) {
            return next(new errorHandler_1.default("Question not found", 404));
        }
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // pushing replies to questions
        question.questionReplies.push(newAnswer);
        await course.save();
        if (userId.toString() === question.user?._id.toString()) {
            await Notification_1.Notification.create({
                user: req.user?.name,
                title: "New Answer Received",
                message: `You have a new question reply in ${courseContent.title}`
            });
        }
        else {
            const data = {
                name: question.user?.name,
                videoTitle: courseContent.title,
                question: question.question,
                answer: answer,
            };
            try {
                await (0, sendMail_1.sendMail)({
                    email: question.user.email,
                    subject: "New Reply to Your Question 💬",
                    template: "question-reply.ejs",
                    data
                });
            }
            catch (error) {
                console.error("Failed to send email:", error.message);
            }
        }
        res.status(201).json({
            success: true,
            message: "Replied successfully",
            course
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// add review
exports.addReview = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { review, rating } = req.body;
        const courseId = req.params.id;
        const course = await Course_1.Course.findById(courseId);
        if (!course) {
            return next(new errorHandler_1.default("Course not found", 404));
        }
        const newReview = {
            user: req.user,
            rating,
            comment: review,
            createdAt: new Date()
        };
        course.reviews.push(newReview);
        let avg = 0;
        course.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        course.ratings = avg / course.reviews.length;
        await course.save();
        await redis_1.default.del(courseId);
        res.status(200).json({
            success: true,
            message: "Review added successfully",
            course
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// add reply to review
exports.addReplyToReview = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { reviewId, courseId, comment } = req.body;
        const course = await Course_1.Course.findById(courseId);
        if (!course) {
            return next(new errorHandler_1.default("Course not Found", 404));
        }
        const review = course?.reviews.find((review) => review._id.toString() === reviewId.toString());
        if (!review) {
            return next(new errorHandler_1.default("Review not Found", 404));
        }
        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review?.commentReplies.push(replyData);
        await course?.save();
        await redis_1.default.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
            success: true,
            message: "Successfully added reply to review",
            course
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// generate video url
const generateVideoUrl = async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: "Video ID is required"
            });
        }
        // Make request to VdoCipher API
        const response = await vdoCipherAxios.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, {
            ttl: 300, // Time to live in seconds
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Apisecret ${process.env.VDOCIPHER_API_SECRET}`
            }
        });
        res.json({
            success: true,
            otp: response.data.otp,
            playbackInfo: response.data.playbackInfo
        });
    }
    catch (error) {
        console.error("VdoCipher Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message
        });
    }
};
exports.generateVideoUrl = generateVideoUrl;
// get all courses for admin only
exports.getAllCoursesAdmin = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        (0, courseService_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 400));
    }
});
// delete a course -- only admin
exports.deleteCourse = (0, catchAsyncErrors_1.catchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course_1.Course.findById(id);
        if (!course) {
            return next(new errorHandler_1.default("Course Not found", 404));
        }
        await course.deleteOne({ id });
        await redis_1.default.del(id);
        res.status(200).json({
            success: true,
            message: "Course deleted Succefully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 404));
    }
});
