import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors"
import cloudinary from 'cloudinary'
import ErrorHandler from "../utlis/errorHandler";
import { createCourse, getAllCoursesService } from "../services/courseService";
import { Course } from "../models/Course";
import redis from "../utlis/redis";
import mongoose from "mongoose";
import https from 'https';
import axios from "axios";
import { sendMail } from "../utlis/sendMail";
import { Notification } from "../models/Notification";

interface IQuestionData {
    question: string,
    courseId: string,
    contentId: string
}

interface IAnswerData {
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string,
}

interface IReviewData {
    review: string
    courseId: string;
    rating: number;
    userId: string;
}

interface IReviewReplyData {
    reviewId: string
    courseId: string;
    comment: string
}

const vdoCipherAxios = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: true,
        servername: 'dev.vdocipher.com',
    })
});


// upload course
export const uploadCourse = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data } = req.body;
        const thumbnail = data.thumbnail

        if (thumbnail) {
            // Upload thumbnail to cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        createCourse(data, res, next)
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
}
)

// edit course
export const editCourse = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const thumbnail = data.thumbnail
        const courseId = req.params.id
        const courseData = await Course.findById(courseId) as any

        if (thumbnail && typeof thumbnail === 'string' && !thumbnail.startsWith("https")) {
            // New base64 image uploaded - destroy old thumbnail if exists
            if (courseData?.thumbnail?.public_id) {
                await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id)
            }

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "Courses"
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        } else if (thumbnail && typeof thumbnail === 'string' && thumbnail.startsWith("https")) {
            // Keeping existing thumbnail URL
            data.thumbnail = {
                public_id: courseData?.thumbnail?.public_id || "",
                url: courseData?.thumbnail?.url || thumbnail
            }
        }
        const course = await Course.findByIdAndUpdate(courseId, {
            $set: data
        },
            {
                new: true
            })

        res.status(201).json({
            success: true,
            message: "Course updated successfully",
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// get single course
export const getSingleCourse = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id

        const course = await Course.findById(courseId)
            .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
            .populate('reviews.user', 'name avatar role')

        await redis.set(courseId, JSON.stringify(course), "EX", 604800)

        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// Backend - courseController.ts
export const getAllUserEnrolledCourses = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseIds = req.user?.courses || []

            if (userCourseIds.length === 0) {
                return res.status(200).json({
                    success: true,
                    courses: []
                })
            }

            const courseIds = userCourseIds.map((course: any) => course._id)

            // Fetch all enrolled courses
            const courses = await Course.find({
                _id: { $in: courseIds }
            }).select('name description thumbnail ratings purchased categories level')

            res.status(200).json({
                success: true,
                courses
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    }
)

// get all courses - without purchasing 
export const getAllCourses = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const courses = await Course.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))

    }
})

// get course - only valid users
export const getCourseByUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourses = req.user?.courses
        const courseId = req.params.id

        const courseExists = userCourses?.find((course: any) => course._id.toString() === courseId)

        if (!courseExists) {
            return next(new ErrorHandler("You are not eligible to access this course", 403))
        }

        const course = await Course.findById(courseId)

        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getCourseContent = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({
            success: true,
            content: course.courseData,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// add question on a specific course
export const addQuestion = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, contentId, courseId }: IQuestionData = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => {
            return item._id.equals(contentId);
        });

        if (!courseContent) {
            return next(new ErrorHandler("Content not found", 404));
        }

        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: [],
        };

        courseContent.questions.push(newQuestion);

        await Notification.create({
            user: req.user?._id,
            title: "New Question Received",
            message: `You have a new question in ${courseContent.title} from ${req.user?.name}`
        })

        await course.save();

        res.status(200).json({
            success: true,
            message: "Question added successfully",
            course
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// add answer to specific question in a course
export const addAnswer = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, contentId, courseId, questionId }: IAnswerData = req.body

        const userId: any = req.user?._id

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => {
            return item._id.equals(contentId);
        });

        if (!courseContent) {
            return next(new ErrorHandler("Content not found", 404));
        }

        const question: any = courseContent?.questions?.find((item: any) =>
            item._id.toString() === questionId
        );

        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }

        const newAnswer: any = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        // pushing replies to questions
        question.questionReplies.push(newAnswer);

        await course.save();

        if (userId.toString() === question.user?._id.toString()) {
            await Notification.create({
                user: req.user?.name,
                title: "New Answer Received",
                message: `You have a new question reply in ${courseContent.title}`
            })
        }

        else {
            const data = {
                name: question.user?.name,
                videoTitle: courseContent.title,
                question: question.question,
                answer: answer,
            };
            try {
                await sendMail({
                    email: question.user.email,
                    subject: "New Reply to Your Question 💬",
                    template: "question-reply.ejs",
                    data
                });
            } catch (error: any) {
                console.error("Failed to send email:", error.message);
            }
        }

        res.status(201).json({
            success: true,
            message: "Replied successfully",
            course
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// add review
export const addReview = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { review, rating } = req.body
        const courseId = req.params.id

        const course = await Course.findById(courseId)

        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        const newReview: any = {
            user: req.user,
            rating,
            comment: review,
            createdAt: new Date()
        }

        course.reviews.push(newReview)

        let avg = 0
        course.reviews.forEach((rev: any) => {
            avg += rev.rating
        })
        course.ratings = avg / course.reviews.length

        await course.save()

        await redis.del(courseId)

        res.status(200).json({
            success: true,
            message: "Review added successfully",
            course
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// add reply to review
export const addReplyToReview = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reviewId, courseId, comment }: IReviewReplyData = req.body

        const course = await Course.findById(courseId)

        if (!course) {
            return next(new ErrorHandler("Course not Found", 404))
        }

        const review = course?.reviews.find((review: any) => review._id.toString() === reviewId.toString())

        if (!review) {
            return next(new ErrorHandler("Review not Found", 404))
        }

        const replyData: any = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review?.commentReplies.push(replyData)

        await course?.save()

        await redis.set(courseId, JSON.stringify(course), "EX", 604800)

        res.status(200).json({
            success: true,
            message: "Successfully added reply to review",
            course
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// generate video url

export const generateVideoUrl = async (req: any, res: any) => {
    try {
        const { videoId } = req.body;

        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: "Video ID is required"
            });
        }

        // Make request to VdoCipher API
        const response = await vdoCipherAxios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            {
                ttl: 300, // Time to live in seconds
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Apisecret ${process.env.VDOCIPHER_API_SECRET}`
                }
            }
        );

        res.json({
            success: true,
            otp: response.data.otp,
            playbackInfo: response.data.playbackInfo
        });

    } catch (error: any) {
        console.error("VdoCipher Error:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message
        });
    }
};


// get all courses for admin only
export const getAllCoursesAdmin = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// delete a course -- only admin

export const deleteCourse = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const course = await Course.findById(id)

        if (!course) {
            return next(new ErrorHandler("Course Not found", 404))
        }

        await course.deleteOne()

        await redis.del(id)

        res.status(200).json({
            success: true,
            message: "Course deleted Succefully",
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 404))

    }
})
