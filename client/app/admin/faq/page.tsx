"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import EditFaq from '@/app/components/Admin/Customization/EditFaq'
import Heading from '@/app/utils/Heading'
import React from 'react'
import AdminLayout from '@/app/components/Admin/AdminLayout'

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Edit FAQ - Emulate"
                    description="Emulate is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <AdminLayout>
                    <EditFaq />
                </AdminLayout>
            </AdminProtected>
        </div>
    )
}

export default Page