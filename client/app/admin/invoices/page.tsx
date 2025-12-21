"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import AllInvoices from '@/app/components/Admin/Order/AllInvoices'
import AdminLayout from '@/app/components/Admin/AdminLayout'

const Page = () => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Invoices - CampusCore"
          description="CampusCore is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <AdminLayout>
          <AllInvoices />
        </AdminLayout>
      </AdminProtected>
    </div>
  )
}

export default Page