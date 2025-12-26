import Ratings from '@/app/utils/Ratings'
import { Users } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'

type Props = {
  course: any
  isProfile?: boolean
  theme: any
}

const CourseCard: FC<Props> = ({ course, isProfile = false, theme }) => {
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform cursor-pointer ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
      <Link href={`/course/${course._id}`}>
        <div className='relative h-48 overflow-hidden'>
          <img
            src={course.thumbnail?.url}
            alt={course.title}
            className='w-full h-full object-cover transition-transform duration-300 '
          />
          <div className='absolute top-4 right-4 bg-[#37a39a] text-white px-3 py-1 rounded-full text-sm font-semibold'>
            {course.price === 0 ? "Free" : `$${course.price}`}
          </div>
        </div>

        <div className='p-6'>
          <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
            {course.name}
          </h3>

          <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
            {course.description}
          </p>

          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-1'>
              <Ratings rating={course.ratings} />
              <span className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                {(course.ratings || 0).toFixed(1)}
              </span>
            </div>

            {!isProfile && (
              <div className='flex items-center gap-1'>
                <Users size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  {course.purchased || 0}
                </span>
              </div>
            )}
          </div>
          <div className={`mb-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <span>Price: </span>
            <span className='text-[#37a39a]'>${course.price}</span>
            {course.estimatedPrice && course.estimatedPrice > course.price && (
              <span className={`ml-4 line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                ${course.estimatedPrice}
              </span>
            )}
          </div>
          <button className='cursor-pointer w-full py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:bg-[#2d8b7f] transition-all duration-300'>
            {isProfile ? 'Access Course' : 'View Details'}
          </button>

        </div>
      </Link>
    </div>
  )
}

export default CourseCard