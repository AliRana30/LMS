"use client"
import React from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from '../components/Admin/sidebar/AdminSidebar'
import AdminProtected from '../hooks/adminProtected'
import { useSelector } from 'react-redux'
import { useTheme } from 'next-themes'
import DashboardHero from '../components/Admin/DashboardHero'

const Page = () => {
  const { user } = useSelector((state: any) => state.auth)
  const { theme } = useTheme()
  
  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AdminProtected>
        <Heading 
          title={`Admin Dashboard - CampusCore`} 
          description="CampusCore is a platform for the students to learn and get help from teachers"
          keywords="Programming,MERN,Learning,Full-Stack"  
        />
        <div className="flex flex-col lg:flex-row">
          <div className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 lg:fixed lg:left-0 lg:top-0 lg:h-screen">
            <AdminSidebar user={user} />
          </div>
          <div className="w-full lg:ml-[280px] lg:flex-1">
            <DashboardHero isDashboard={true} />
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default Page