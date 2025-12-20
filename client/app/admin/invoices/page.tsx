"use client"
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Menu, X } from 'lucide-react'
import AllInvoices from '@/app/components/Admin/Order/AllInvoices'

const Page = () => {
  const { user } = useSelector((state: any) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>
      <AdminProtected>
        <Heading
          title={`${user?.name} - Emulate`}
          description="Emulate is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className="flex min-h-screen">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div
            className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition-transform duration-300 ease-in-out `}
          >
            <AdminSidebar user={user}/>
          </div>

          <div className="flex-1 md:ml-64">
            <DashboardHero />
            <AllInvoices />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default Page