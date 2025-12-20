import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import CourseCard from './CourseCard'

type Props = {}

const Courses = (props: Props) => {
  const { theme } = useTheme()
  const { data, isLoading } = useGetAllCoursesQuery({})
  const [courses, setCourses] = useState([])
  

  useEffect(() => {
    if (data) {
      setCourses(data?.courses)
    }
  }, [data])

  return (
    <div className={`w-full min-h-screen pt-[80px] pb-20 font-poppins transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`} suppressHydrationWarning>
      <div className='w-[95%] md:w-[85%] mx-auto'>
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Expand Your Knowledge
        </h1>
        <p className={`text-center mb-12 text-lg ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Explore our diverse course catalog and start learning today
        </p>

        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='animate-pulse'>
                <div className='bg-gray-300 dark:bg-gray-700 h-48 rounded-t-xl'></div>
                <div className={`p-6 rounded-b-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4'></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses && courses.map((course: any, index: number) => (
              <CourseCard key={index} course={course} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses