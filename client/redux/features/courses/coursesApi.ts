import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: "create-course",
        method: "POST",
        body: { ...courseData },
        credentials: "include" as const,
      })
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `delete-course/${courseId}`,
        method: "DELETE",
        credentials: "include" as const,
      })
    }),
    editCourse: builder.mutation({
      query: ({ courseId, courseData }) => ({
        url: `edit-course/${courseId}`,
        method: "PUT",
        body: { ...courseData },
        credentials: "include" as const,
      })
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      })
    }),
    getUsersAllCourses: builder.query({
      query: (userId) => ({
        url: `get-user-courses/${userId}`,
        method: "GET",
        credentials: "include" as const,
      })
    }),
    getAllUserEnrolledCourses: builder.query({
      query: () => ({
        url: `get-all-user-courses`,
        method: "GET",
        credentials: "include" as const,
      })
    }),
    getCourseDetails: builder.query({
      query: (courseId) => ({
        url: `get-course/${courseId}`,
        method: "GET",
        credentials: "include" as const,
      })
    }),
    getCourseContent: builder.query({
      query: (courseId) => ({
        url: `get-course-content/${courseId}`,
        method: "GET",
        credentials: "include" as const,
      })
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: `add-question/${courseId}`,
        method: "PUT",
        body: { question, contentId, courseId },
        credentials: "include" as const,
      })
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ courseId, contentId, questionId, answer }) => ({
        url: `add-answer`,
        method: "PUT",
        body: { courseId, contentId, questionId, answer },
        credentials: "include" as const,
      })
    }),
    addReviewInCourse: builder.mutation({
      query: ({ courseId, review, rating }) => ({
        url: `add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include" as const,
      })
    }),
    addReplyInReview: builder.mutation({
      query: ({ reviewId, courseId, comment }) => ({
        url: `add-reply`,
        method: "PUT",
        body: { reviewId, courseId, comment },
        credentials: "include" as const,
      })
    }),
  })
})

export const {
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetAllCoursesQuery,
  useGetUsersAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
  useGetAllUserEnrolledCoursesQuery
} = courseApi

// Alias for backward compatibility
export const useGetCoursesQuery = useGetAllCoursesQuery