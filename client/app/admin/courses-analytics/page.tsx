"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import CourseAnalytics from '@/app/components/Admin/Analytics/CourseAnalytics'
import Heading from '@/app/utils/Heading'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import React from 'react'

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Courses Analytics - CampusCore"
                    description="CampusCore is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <AdminLayout>
                    <CourseAnalytics />
                </AdminLayout>
            </AdminProtected>
        </div>
    )
}

export default Page