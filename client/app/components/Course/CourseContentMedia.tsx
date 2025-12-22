"use client";
import CoursePlayer from '@/app/utils/CoursePlayer'
import Ratings from '@/app/utils/Ratings'
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { MdLink, MdVerified } from 'react-icons/md'
import { BiMessage } from 'react-icons/bi'
import { useTheme } from 'next-themes'
import { useAddNewQuestionMutation, useAddAnswerInQuestionMutation, useAddReviewInCourseMutation, useAddReplyInReviewMutation } from '@/redux/features/courses/coursesApi';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import { format } from 'timeago.js';
import socketIO from "socket.io-client"
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
    id: string,
    activeVideo: number,
    setActiveVideo: (activeVideo: number) => void,
    data: any
    courseData?: any
    user: any
    refetch?: any
}

const CourseContentMedia: FC<Props> = ({ id, activeVideo, setActiveVideo, data, courseData, user, refetch }) => {
     const { theme } = useTheme()
    const [addNewQuestion, { isSuccess, error, isLoading }] = useAddNewQuestionMutation({})
    const [addReviewInCourse, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewLoading }] = useAddReviewInCourseMutation()
    const [addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerLoading }] = useAddAnswerInQuestionMutation()
    const [addReplyInReview, { isSuccess: reviewReplySuccess, error: reviewReplyError, isLoading: reviewReplyLoading }] = useAddReplyInReviewMutation()

    const [question, setQuestion] = useState('')
    const [answerId, setAnswerId] = useState('')
    const [answer, setAnswer] = useState('')
    const [activeBar, setActiveBar] = useState(0)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [reviewReplyId, setReviewReplyId] = useState('')
    const [reviewReply, setReviewReply] = useState('')

    // Check if user has already reviewed 
    const isReviewExists = () => {
        const courseReviews = courseData?.reviews || [];
        const reviewExists = courseReviews.find((item: any) => item.user._id === user._id);
        return !!reviewExists;
    }

    const handleQuestionSubmit = async () => {
        if (question.length === 0) {
            toast.error("Question cannot be empty")
            return
        }
        await addNewQuestion({
            courseId: id,
            contentId: data[activeVideo]?._id,
            question: question
        })
    }

    const handleAnswerSubmit = async () => {
        if (answer.length === 0) {
            toast.error("Answer cannot be empty")
            return
        }
        await addAnswerInQuestion({
            courseId: id,
            contentId: data[activeVideo]?._id,
            questionId: answerId,
            answer: answer
        })
    }

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }
        if (review.length === 0) {
            toast.error("Review cannot be empty")
            return
        }
        await addReviewInCourse({
            courseId: id,
            rating: rating,
            review: review
        })
    }

    const handleReviewReplySubmit = async () => {
        if (reviewReply.length === 0) {
            toast.error("Reply cannot be empty")
            return
        }
        await addReplyInReview({
            courseId: id,
            reviewId: reviewReplyId,
            reply: reviewReply
        })
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Question added successfully")
            setQuestion('')
            refetch()
            socketId.emit("notification", {
                title: "New Question",
                message: `You have a new question in ${data[activeVideo]?.title}`,
                userId: courseData?.user?._id, 
            });
        }
        if (error) {
            if ('data' in error) {
                const errMsg = (error.data as any).message
                toast.error(errMsg)
            }
        }
    }, [isSuccess, error])

    useEffect(() => {
        if (answerSuccess) {
            toast.success("Answer added successfully")
            setAnswer('')
            setAnswerId('')
            refetch()
            
            // Find the question owner to send notification
            const question = data[activeVideo]?.questions?.find((q: any) => q._id === answerId);
            if (question && user.role === "admin") {
                // Admin replied - notify the question owner
                socketId.emit("notification", {
                    title: "New Reply",
                    message: `You have a new reply on your question in ${data[activeVideo]?.title}`,
                    userId: question.user._id, // Send to question owner
                });
            } else if (question && user.role !== "admin") {
                // Student replied - notify admin/instructor
                socketId.emit("notification", {
                    title: "New Answer",
                    message: `Someone answered a question in ${data[activeVideo]?.title}`,
                    userId: courseData?.user?._id,
                });
            }
        }
        if (answerError) {
            if ('data' in answerError) {
                const errMsg = (answerError.data as any).message
                toast.error(errMsg)
            }
        }
    }, [answerSuccess, answerError])

    useEffect(() => {
        if (reviewSuccess) {
            toast.success("Review added successfully")
            setRating(0)
            setReview('')
            refetch()
            // Send notification to course creator
            socketId.emit("notification", {
                title: "New Review",
                message: `You have a new review in ${courseData?.name}`,
                userId: courseData?.user?._id, 
            });
        }
        if (reviewError) {
            if ('data' in reviewError) {
                const errMsg = (reviewError.data as any).message
                toast.error(errMsg)
            }
        }
    }, [reviewSuccess, reviewError])

    useEffect(() => {
        if (reviewReplySuccess) {
            toast.success("Reply added successfully")
            setReviewReply('')
            setReviewReplyId('')
            refetch()
            
            // Find the review to get the reviewer's userId
            const review = courseData?.reviews?.find((r: any) => r._id === reviewReplyId);
            if (review && user.role === "admin") {
                // Admin replied to a review - notify the reviewer
                socketId.emit("notification", {
                    title: "New Reply on Review",
                    message: `The instructor replied to your review on ${courseData?.name}`,
                    userId: review.user._id, // Send to reviewer
                });
            }
        }
        if (reviewReplyError) {
            if ('data' in reviewReplyError) {
                const errMsg = (reviewReplyError.data as any).message
                toast.error(errMsg)
            }
        }
    }, [reviewReplySuccess, reviewReplyError])


    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="w-full min-h-screen font-poppins mt-4 sm:mt-8 md:mt-12 lg:mt-20">
            <div className="w-full mx-auto py-4 sm:py-6 md:py-8">
                {/* Video Player */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <CoursePlayer
                        title={data[activeVideo]?.title}
                        videoUrl={data[activeVideo]?.videoUrl}
                    />
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <button
                        onClick={() => activeVideo > 0 && setActiveVideo(activeVideo - 1)}
                        disabled={activeVideo === 0}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto justify-center text-sm sm:text-base ${activeVideo === 0
                                ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-500'
                                : 'bg-[#37a39a] text-white hover:bg-[#2d8b7f] shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                    >
                        <AiOutlineArrowLeft size={20} />
                        <span>Prev Lesson</span>
                    </button>

                    <button
                        onClick={() => activeVideo < data.length - 1 && setActiveVideo(activeVideo + 1)}
                        disabled={activeVideo === data.length - 1}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto justify-center text-sm sm:text-base ${activeVideo === data.length - 1
                                ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-700 text-gray-500'
                                : 'bg-[#37a39a] text-white hover:bg-[#2d8b7f] shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                    >
                        <span>Next Lesson</span>
                        <AiOutlineArrowRight size={20} />
                    </button>
                </div>

                {/* Video Title */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        {data[activeVideo]?.title}
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8 border-b border-gray-300 dark:border-gray-700">
                    {["Overview", "Resources", "Q&A", "Reviews"].map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveBar(index)}
                            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 border-b-2 ${activeBar === index
                                    ? 'border-[#37a39a] text-[#37a39a]'
                                    : theme === 'dark'
                                        ? 'border-transparent text-gray-400 hover:text-gray-200'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-4 sm:mt-6">
                    {/* Overview Tab */}
                    {activeBar === 0 && (
                        <div>
                            <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {data[activeVideo]?.description}
                            </p>
                        </div>
                    )}

                    {/* Resources Tab */}
                    {activeBar === 1 && (
                        <div className="space-y-4">
                            {data[activeVideo]?.links?.length > 0 ? (
                                data[activeVideo]?.links.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg transition-all duration-300 ${theme === 'dark'
                                                ? 'bg-gray-800 hover:bg-gray-700'
                                                : 'bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <MdLink
                                                className="text-[#37a39a] flex-shrink-0 mt-1"
                                                size={24}
                                            />
                                            <div>
                                                {item.title && (
                                                    <h2 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {item.title}
                                                    </h2>
                                                )}
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#37a39a] hover:text-[#2d8b7f] underline break-all text-sm md:text-base transition-colors duration-300"
                                                >
                                                    {item.url}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    No resources available for this lesson.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Q&A Tab */}
                    {activeBar === 2 && (
                        <>
                            <div className="mb-8">
                                <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Ask a Question
                                </h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <Image
                                        src={user?.avatar?.url || "/noimage.png"}
                                        width={50}
                                        height={50}
                                        alt='User Avatar'
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h3 className={`font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {user?.name || 'Student'}
                                            {user?.role === 'admin' && (
                                                <MdVerified className='text-green-500' size={20} />
                                            )}
                                        </h3>
                                    </div>
                                </div>
                                { user?.role !== 'admin' && (
                                    <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Ask a question about this lesson..."
                                    rows={4}
                                    className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-[#37a39a] transition-all duration-300 ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                        />
                                    )
                                    }
                                     { user?.role !== 'admin' && (
                                <button
                                    className="cursor-pointer mt-4 px-6 py-3 bg-[#37a39a] text-white rounded-full font-semibold hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    onClick={handleQuestionSubmit}
                                >
                                    {isLoading ? 'Posting...' : 'Post Question'}
                                </button>
                                     )}
                            </div>

                            <div className="space-y-6">
                                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    All Questions
                                </h2>
                                {data[activeVideo]?.questions && data[activeVideo]?.questions.length > 0 ? (
                                    data[activeVideo]?.questions.map((item: any, index: number) => (
                                        <CommentItem
                                            key={index}
                                            item={item}
                                            theme={theme}
                                            answer={answer}
                                            setAnswer={setAnswer}
                                            answerId={answerId}
                                            setAnswerId={setAnswerId}
                                            handleAnswerSubmit={handleAnswerSubmit}
                                            answerLoading={answerLoading}
                                        />
                                    ))
                                ) : (
                                    <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        No questions yet. Be the first to ask!
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Reviews Tab */}
                    {activeBar === 3 && (
                        <div className="space-y-6">
                            {!isReviewExists() && (
                                <div className="mb-8">
                                    <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Write a Review
                                    </h2>
                                    <div className="flex items-center gap-4 mb-6">
                                        <Image
                                            src={user?.avatar?.url || "/noimage.png"}
                                            width={50}
                                            height={50}
                                            alt='User Avatar'
                                            className="rounded-full"
                                        />
                                        <div>
                                            <h3 className={`font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {user?.name || 'Student'}
                                                {user?.role === 'admin' && (
                                                    <MdVerified className='text-green-500' size={20} />
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="mb-4">
                                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                            Rate this course:
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="transition-all duration-200 hover:scale-110"
                                                >
                                                    {star <= rating ? (
                                                        <AiFillStar size={32} className="text-yellow-400" />
                                                    ) : (
                                                        <AiOutlineStar size={32} className={
                                                            theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                                        } />
                                                    )}
                                                </button>
                                            ))}
                                            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                {rating > 0 ? `${rating} out of 5` : 'Select rating'}
                                            </span>
                                        </div>
                                    </div>

                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Share your experience with this course..."
                                        rows={6}
                                        className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-[#37a39a] transition-all duration-300 ${theme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                    />
                                    <button
                                        className="mt-4 px-6 py-3 bg-[#37a39a] text-white rounded-full font-semibold hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        onClick={handleReviewSubmit}
                                        disabled={reviewLoading}
                                    >
                                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            )}

                            {/* Display Existing Reviews */}
                            <div>
                                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Course Reviews ({courseData?.reviews?.length || 0})
                                </h2>
                                <div className="space-y-4">
                                    {courseData?.reviews && courseData.reviews.length > 0 ? (
                                        courseData.reviews.map((item: any, index: number) => (
                                            <ReviewItem
                                                key={index}
                                                item={item}
                                                theme={theme}
                                                user={user}
                                                reviewReply={reviewReply}
                                                setReviewReply={setReviewReply}
                                                reviewReplyId={reviewReplyId}
                                                setReviewReplyId={setReviewReplyId}
                                                handleReviewReplySubmit={handleReviewReplySubmit}
                                                reviewReplyLoading={reviewReplyLoading}
                                            />
                                        ))
                                    ) : (
                                        <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            No reviews yet. Be the first to review this course!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Comment Item Component
const CommentItem: FC<any> = ({ item, theme, answer, setAnswer, answerId, setAnswerId, handleAnswerSubmit, answerLoading }) => {
    const [replyActive, setReplyActive] = useState(false)

    return (
        <div className="pb-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                <Image
                    src={item.user?.avatar?.url || "/noimage.png"}
                    width={50}
                    height={50}
                    alt='User Avatar'
                    className="rounded-full flex-shrink-0"
                />
                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className={`font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {item.user?.name}
                            {item.user?.role === 'admin' && (
                                <MdVerified className='text-green-500' size={18} />
                            )}
                        </h4>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {format(item.createdAt)}
                        </span>
                    </div>
                    <p className={`text-sm mb-3 break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.question}
                    </p>
                    <button
                        onClick={() => setReplyActive(!replyActive)}
                        className="flex items-center gap-2 text-[#37a39a] hover:text-[#2d8b7f] text-sm font-semibold transition-colors duration-300"
                    >
                        <BiMessage size={18} />
                        {item.questionReplies?.length > 0 ? `${item.questionReplies.length} Replies` : 'Reply'}
                    </button>
                </div>
            </div>

            {/* Replies */}
            {item.questionReplies && item.questionReplies.length > 0 && (
                <div className="ml-0 sm:ml-16 space-y-4 mb-4 mt-4">
                    {item.questionReplies.map((reply: any, idx: number) => (
                        <div key={idx} className="pl-4 border-l-2 border-gray-300 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                                <Image
                                    src={reply.user?.avatar?.url || "/noimage.png"}
                                    width={40}
                                    height={40}
                                    alt='User Avatar'
                                    className="rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h5 className={`font-semibold text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {reply.user?.name}
                                            {reply.user?.role === 'admin' && (
                                                <MdVerified className='text-green-500' size={16} />
                                            )}
                                        </h5>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {format(reply.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-sm break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {reply.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Form */}
            {replyActive && (
                <div className="ml-0 sm:ml-16 mt-4">
                    <textarea
                        value={answerId === item._id ? answer : ''}
                        onChange={(e) => {
                            setAnswerId(item._id)
                            setAnswer(e.target.value)
                        }}
                        placeholder="Write your reply..."
                        rows={3}
                        className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-[#37a39a] transition-all duration-300 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <button
                            className="px-5 py-2 bg-[#37a39a] text-white rounded-full font-semibold hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={handleAnswerSubmit}
                            disabled={answerLoading}
                        >
                            {answerLoading ? 'Posting...' : 'Post Reply'}
                        </button>
                        <button
                            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${theme === 'dark'
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                }`}
                            onClick={() => {
                                setReplyActive(false)
                                setAnswer('')
                                setAnswerId('')
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Review Item Component
const ReviewItem: FC<any> = ({ item, theme, user, reviewReply, setReviewReply, reviewReplyId, setReviewReplyId, handleReviewReplySubmit, reviewReplyLoading }) => {
    const [replyActive, setReplyActive] = useState(false)
    const isAdmin = user?.role === 'admin'

    return (
        <div className="pb-4">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-3">
                <Image
                    src={item.user?.avatar?.url || "/noimage.png"}
                    width={40}
                    height={40}
                    alt='User Avatar'
                    className="rounded-full flex-shrink-0"
                />
                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                            <h4 className={`font-semibold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                {item.user?.name || 'Anonymous'}
                                {item.user?.role === 'admin' && (
                                    <MdVerified className='text-green-500' size={18} />
                                )}
                            </h4>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                {format(item.createdAt)}
                            </span>
                        </div>
                        <Ratings rating={item.rating} />
                    </div>
                    <p className={`text-sm mt-2 mb-3 break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        {item.comment}
                    </p>

                    {/* Admin Reply Button */}
                    {isAdmin && (
                        <button
                            onClick={() => setReplyActive(!replyActive)}
                            className="flex items-center gap-2 text-[#37a39a] hover:text-[#2d8b7f] text-sm font-semibold transition-colors duration-300"
                        >
                            <BiMessage size={18} />
                            {item.commentReplies?.length > 0 ? `${item.commentReplies.length} Replies` : 'Reply'}
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Replies */}
            {item.commentReplies && item.commentReplies.length > 0 && (
                <div className="ml-0 sm:ml-12 space-y-4 mt-4">
                    {item.commentReplies.map((reply: any, idx: number) => (
                        <div key={idx} className="pl-4 border-l-2 border-[#37a39a]">
                            <div className="flex flex-col sm:flex-row items-start gap-3">
                                <Image
                                    src={reply.user?.avatar?.url || "/noimage.png"}
                                    width={35}
                                    height={35}
                                    alt='User Avatar'
                                    className="rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                        <h5 className={`font-semibold text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {reply.user?.name}
                                            {reply.user?.role === 'admin' && (
                                                <MdVerified className='text-green-500' size={16} />
                                            )}
                                        </h5>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {format(reply.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-sm break-words ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {reply?.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Form - Only for Admin */}
            {isAdmin && replyActive && (
                <div className="ml-0 sm:ml-12 mt-4">
                    <textarea
                        value={reviewReplyId === item._id ? reviewReply : ''}
                        onChange={(e) => {
                            setReviewReplyId(item._id)
                            setReviewReply(e.target.value)
                        }}
                        placeholder="Write your reply..."
                        rows={3}
                        className={`w-full p-4 rounded-lg border-2 focus:outline-none focus:border-[#37a39a] transition-all duration-300 ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <button
                            className="px-5 py-2 bg-[#37a39a] text-white rounded-full font-semibold hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={handleReviewReplySubmit}
                            disabled={reviewReplyLoading}
                        >
                            {reviewReplyLoading ? 'Posting...' : 'Post Reply'}
                        </button>
                        <button
                            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${theme === 'dark'
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                }`}
                            onClick={() => {
                                setReplyActive(false)
                                setReviewReply('')
                                setReviewReplyId('')
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseContentMedia