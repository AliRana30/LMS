"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import OrderAnalytics from '@/app/components/Admin/Analytics/OrderAnalytics'
import AdminLayout from '@/app/components/Admin/AdminLayout'

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Order Analytics - Emulate"
                    description="Emulate is a platform for students to learn and get help from teachers"
                    keywords="Programming, MERN, Redux, Machine Learning"
                />
                <AdminLayout>
                    <OrderAnalytics />
                </AdminLayout>
            </AdminProtected>
        </div>
    )
}

export default Page