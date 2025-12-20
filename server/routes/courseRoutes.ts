import express from "express"
import { isAuthenticated, updateAccessToken, validateUserRole } from "../middlewares/auth"
import { addAnswer, addQuestion, addReplyToReview, addReview, deleteCourse, editCourse, generateVideoUrl, getAllCourses, getAllCoursesAdmin, getAllUserEnrolledCourses, getCourseByUser, getCourseContent, getSingleCourse, uploadCourse } from "../controllers/courseController"

export const courseRouter = express.Router()

courseRouter.post("/create-course", updateAccessToken, isAuthenticated , validateUserRole("admin") , uploadCourse)

courseRouter.put("/edit-course/:id", isAuthenticated , validateUserRole("admin") , editCourse)

courseRouter.get("/get-course/:id" , getSingleCourse)

courseRouter.get("/get-courses" , getAllCourses)

courseRouter.get("/get-user-courses/:id",updateAccessToken , isAuthenticated, getCourseByUser)

courseRouter.get("/get-all-user-courses", updateAccessToken, isAuthenticated, getAllUserEnrolledCourses)

courseRouter.get("/get-course-content/:id", updateAccessToken, isAuthenticated, getCourseContent);

courseRouter.put("/add-question/:id",updateAccessToken, isAuthenticated  , addQuestion)

courseRouter.put("/add-answer", updateAccessToken, isAuthenticated  , addAnswer)

courseRouter.put("/add-review/:id", isAuthenticated  , addReview)

courseRouter.put("/add-reply", isAuthenticated , validateUserRole("admin") , addReplyToReview)

courseRouter.get("/get-all-courses" , isAuthenticated , validateUserRole("admin") , getAllCoursesAdmin )

courseRouter.post("/getVdoCipherOTP"  , generateVideoUrl )

courseRouter.delete("/delete-course/:id",updateAccessToken,  isAuthenticated , validateUserRole("admin") , deleteCourse)






