import Ratings from '@/app/utils/Ratings'
import CoursePlayer from '../../../utils/CoursePlayer'
import React, { FC } from 'react'
import { useTheme } from 'next-themes'
import { BiCheck } from 'react-icons/bi'

type Props = {
  courseData: any
  active: number
  setActive: (active: number) => void
  handleCourseCreate: () => void
  isEdit?: boolean
}

const CoursePreview: FC<Props> = ({ courseData, active, setActive, handleCourseCreate , isEdit}) => {
  const { theme } = useTheme()
  const discountPercentage = Math.round(((courseData.estimatedPrice - courseData.price) / courseData.estimatedPrice) * 100)

  const createCourse = () => {
    handleCourseCreate()
  }

  return (
    <div className={`font-poppins ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className="space-y-6">
        <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.name} />
        </div>

        <div>
          <h2 className='text-3xl font-bold'>{courseData?.name}</h2>
          <p className='mt-3 text-lg opacity-80'>{courseData?.description}</p>

          <div className='mt-6 flex items-center gap-4 flex-wrap'>
            <span className='text-3xl font-bold text-[#37a39a]'>
              ${courseData?.price === 0 ? "FREE" : courseData?.price}
            </span>
            {courseData?.price > 0 && (
              <>
                <span className='text-xl line-through opacity-50'>${courseData?.estimatedPrice}</span>
                <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold'>
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
          <h3 className='font-bold text-xl mb-4'>This Course Includes:</h3>
          <div className='space-y-2'>
            <p className='flex items-center gap-2'><BiCheck className='text-green-500' size={24} /> Source Code Included</p>
            <p className='flex items-center gap-2'><BiCheck className='text-green-500' size={24} /> Lifetime Access</p>
            <p className='flex items-center gap-2'><BiCheck className='text-green-500' size={24} /> Certificate of Completion</p>
            <p className='flex items-center gap-2'><BiCheck className='text-green-500' size={24} /> Premium Support</p>
          </div>
        </div>

        <div>
          <h3 className='font-bold text-2xl mb-4'>What you will learn from this course</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {courseData?.benefits?.map((item: any, index: number) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                <BiCheck className='text-green-500 flex-shrink-0 mt-1' size={20} />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {courseData?.prerequisites && courseData.prerequisites.length > 0 && (
          <div>
            <h3 className='font-bold text-2xl mb-4'>Prerequisites</h3>
            <div className='space-y-2'>
              {courseData?.prerequisites?.map((item: any, index: number) => (
                <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-gray-50'}`}>
                  <span className='font-bold text-[#37a39a]'>{index + 1}.</span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-4 pt-6'>
          <button type="button" onClick={() => setActive(active - 1)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold cursor-pointer">
            ← Previous
          </button>
          <button type="button" onClick={createCourse}
            className="flex-1 bg-[#37a39a] hover:bg-[#2d8b7f] text-white px-8 py-3 rounded-lg transition-colors font-semibold cursor-pointer">
           {isEdit ?  "Update →" : "Create Course →"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoursePreview