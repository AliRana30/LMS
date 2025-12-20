import React, { FC } from 'react'
import { useGetAllUserEnrolledCoursesQuery, useGetUsersAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { FaUsers, FaStar } from 'react-icons/fa'
import Loader from '../Loader/Loader'

type Props = {
}

const EnrolledCourses: FC<Props> = () => {
    const { theme } = useTheme()
    const { data, isLoading } = useGetAllUserEnrolledCoursesQuery(undefined, {})

    if (isLoading) {
        return <Loader/>
    }

    const enrolledCourses = data?.courses || []

    return (
        <div className="font-poppins">
            <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
                Enrolled Courses ({enrolledCourses.length})
            </h2>
            
            {enrolledCourses && enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course: any, index: number) => (
                        <Link 
                            href={`/course-access/${course._id}`} 
                            key={index}
                        >
                            <div className={`rounded-xl overflow-hidden transition-all duration-300  cursor-pointer ${
                                theme === 'dark'
                                    ? 'bg-gray-800 border border-gray-700 shadow-xl'
                                    : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
                            }`}>
                                {/* Course Thumbnail */}
                                <div className="relative w-full h-48">
                                    <Image
                                        src={course.thumbnail?.url || '/placeholder-course.jpg'}
                                        alt={course.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Course Details */}
                                <div className="p-4">
                                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {course.name}
                                    </h3>
                                    
                                    <p className={`text-sm mb-3 line-clamp-2 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {course.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" size={14} />
                                            <span className={`text-sm font-semibold ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {course.ratings?.toFixed(1) || 0}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <FaUsers className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={14} />
                                            <span className={`text-sm ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                {course.purchased || 0} students
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                    </div>

                                    <div className='mt-5'>
                                    <button className="cursor-pointer w-full py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:bg-[#2d8b7f] transition-all duration-300">
                                        Continue Learning
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={`text-center py-12 rounded-xl ${
                    theme === 'dark'
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200 shadow-lg'
                }`}>
                    <div className="mb-4">
                        <svg
                            className={`mx-auto h-16 w-16 ${
                                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <p className={`text-lg font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        No Enrolled Courses Yet
                    </p>
                    <p className={`text-sm mb-6 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                        Start your learning journey by enrolling in a course
                    </p>
                    <Link href="/courses">
                        <button className="px-6 py-3 bg-gradient-to-r from-[#37a39a] to-[#2d8b7f] text-white rounded-full font-semibold hover:shadow-xl transition-all">
                            Browse Courses
                        </button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default EnrolledCourses