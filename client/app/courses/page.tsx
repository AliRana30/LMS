"use client"
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'
import Loader from '../components/Loader/Loader'
import Header from '../components/Header'
import Heading from '../utils/Heading'
import { useTheme } from 'next-themes'
import CourseCard from '../components/Course/CourseCard'
import Footer from '../components/Footer'

type Props = {}

const CoursesContent = (props: Props) => {
    const searchParams = useSearchParams()
    const { theme } = useTheme()
    const search = searchParams?.get('title')
    const { data, isLoading } = useGetAllCoursesQuery({ title: search }, { refetchOnMountOrArgChange: true })
    const { data: courseData } = useGetHeroDataQuery("Categories", { refetchOnMountOrArgChange: true })
    const [route, setRoute] = useState('login')
    const [open, setOpen] = useState(false)
    const [courses, setCourses] = useState([])
    const [category, setCategory] = useState("All")

    useEffect(() => {
        if (category === "All") {
            setCourses(data?.courses)
        }
        if (category !== "All") {
            const filteredCourses = data?.courses?.filter((course: any) =>
                course.categories?.toLowerCase() === category?.toLowerCase() ||
                course.category?.toLowerCase() === category?.toLowerCase()
            )
            setCourses(filteredCourses)
        }
        if (search) {
            setCourses(data?.courses.filter((course: any) => course.name?.toLowerCase().includes(search.toLowerCase())))
        }
    }, [data, category, search])

    const categories = courseData?.layout?.categories || []

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
            }`}>
            <Heading
                title="Campus Core"
                description="CampusCore is a platform for the students to learn and get help from teachers"
                keywords="Programming,MERN,Learning,Full-Stack"
            />
            <Header open={open} setOpen={setOpen} activeItem={1} route={route} setRoute={setRoute} />

            <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        {search ? `Search Results for "${search}"` : 'All Courses'}
                    </h1>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {courses?.length || 0} courses found
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8 mt-10">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setCategory("All")}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${category === "All"
                                    ? 'bg-[#37a39a] text-white shadow-lg'
                                    : theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCategory(cat.title)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${category === cat.title
                                        ? 'bg-[#37a39a] text-white shadow-lg'
                                        : theme === 'dark'
                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                {courses && courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map((course: any, index: number) => (
                            <CourseCard key={index} course={course} theme={theme} />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        <p className="text-xl font-semibold mb-2">No courses found</p>
                        <p>Try adjusting your search or category filter</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

const Page = (props: Props) => {
    return (
        <Suspense fallback={<Loader />}>
            <CoursesContent {...props} />
        </Suspense>
    )
}

export default Page