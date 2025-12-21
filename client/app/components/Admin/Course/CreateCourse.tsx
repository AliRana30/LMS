"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useCreateCourseMutation } from '@/redux/features/courses/coursesApi'
import toast from 'react-hot-toast'
import { redirect } from 'next/navigation'

const CourseInformation = dynamic(() => import('./CourseInformation'))
const CourseOptions = dynamic(() => import('./CourseOptions'))
const CourseData = dynamic(() => import('./CourseData'))
const CourseContent = dynamic(() => import('./CourseContent'))
const CoursePreview = dynamic(() => import('./CoursePreview'))

type Props = {}

const CreateCourse = (props: Props) => {
  const { theme } = useTheme()
  const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation()
  const [active, setActive] = useState(0)
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    categories : "",
    demoUrl: "",
    thumbnail: ""
  })
  const [benefits, setBenefits] = useState([{ title: "" }])
  const [prerequisites, setPrerequisites] = useState([{ title: "" }])
  const [courseContentData, setCourseContentData] = useState([{
    videoUrl: "",
    title: "",
    description: "",
    videoSection: "Untitled Section",
    videoLength : "",
    links: [{ title: "", url: "" }],
    suggestions: ""
  }])
  const [courseData, setCourseData] = useState({})

  const handleSubmit = (e: any) => {
    const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }))
    const formattedPreRequisites = prerequisites.map((prerequisites) => ({ title: prerequisites.title }))
    const formattedCourseContentData = courseContentData.map((content) => ({
      videoUrl: content.videoUrl,
      title: content.title,
      description: content.description,
      videoSection: content.videoSection,
      videoLength : content.videoLength,
      links: content.links?.map((link) => ({ title: link.title, url: link.url })),
      suggestions: content.suggestions
    }))

    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      categories: courseInfo.categories,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPreRequisites,
      courseData: formattedCourseContentData
    }
    setCourseData(data)
  }

  const handleCourseCreate = async () => {
    try {
      if (!isLoading) {
        await createCourse({ data: courseData })
      }
    } catch (error) {
      toast.error("Failed to create course. Please try again.")
    }
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully!")
      redirect("/admin/courses")
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any
        toast.error(errorMessage.data.message || "Failed to create course. Please try again.")
      }
    }
  }, [isSuccess, error])

  const getTitleByStep = () => {
    switch (active) {
      case 0: return "Course Information"
      case 1: return "Course Data"
      case 2: return "Course Content"
      case 3: return "Course Preview"
      default: return "Create Course"
    }
  }

  return (
    <div className={`min-h-screen w-full transition-all duration-500 font-poppins ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>

      <div className={`sticky top-0 z-10 backdrop-blur-lg border-b transition-all duration-300 ${theme === 'dark'
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-slate-200/50'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Create New Course
              </h1>
              <p className={`mt-1 text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Step {active + 1} of 4 - {getTitleByStep()}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:hidden">
              <div className={`flex-1 h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500" style={{ width: `${((active + 1) / 4) * 100}%` }} />
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {Math.round(((active + 1) / 4) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border ${theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
              }`}>
              <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {getTitleByStep()}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    Step {active + 1}/4
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6 lg:p-8">
                {active === 0 && <CourseInformation courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive} />}
                {active === 1 && <CourseData benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} active={active} setActive={setActive} />}
                {active === 2 && <CourseContent active={active} setActive={setActive} courseContentData={courseContentData} setCourseContentData={setCourseContentData} handleSubmit={handleSubmit} />}
                {active === 3 && <CoursePreview courseData={courseData} active={active} setActive={setActive} handleCourseCreate={handleCourseCreate} />}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-80 xl:w-96 order-1 lg:order-2">
            <div className={`lg:sticky lg:top-28 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border ${theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
              }`}>
              <CourseOptions active={active} setActive={setActive} />
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-2xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Creating your course...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateCourse