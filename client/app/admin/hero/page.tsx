"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import EditHero from '@/app/components/Admin/Customization/EditHero'
import Heading from '@/app/utils/Heading'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import React from 'react'

const Page = () => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Hero Settings - CampusCore"
          description="CampusCore is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <AdminLayout>
          <EditHero />
        </AdminLayout>
      </AdminProtected>
    </div>
  )
}

export default Page
