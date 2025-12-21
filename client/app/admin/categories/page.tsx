"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import EditCategories from '@/app/components/Admin/Customization/EditCategories'
import AdminLayout from '@/app/components/Admin/AdminLayout'

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Categories - CampusCore"
                    description="CampusCore is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <AdminLayout>
                    <EditCategories />
                </AdminLayout>
            </AdminProtected>
        </div>
    )
}

export default Page