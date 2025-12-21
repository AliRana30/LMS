"use client"
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from 'next-themes'
import AdminSidebar from './sidebar/AdminSidebar'
import DashboardHeader from './DashboardHeader'

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
  const { user } = useSelector((state: any) => state.auth)
  const { theme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar - Always visible on large screens */}
        <div className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 lg:fixed lg:left-0 lg:top-0 lg:h-screen">
          <AdminSidebar user={user} />
        </div>
        
        {/* Mobile Sidebar - Toggleable on small/medium screens */}
        <div className="lg:hidden">
          <AdminSidebar 
            user={user} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        </div>
        
        <div className="w-full lg:ml-[280px] lg:flex-1">
          <DashboardHeader 
            open={open} 
            setOpen={setOpen} 
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          <div className="p-4 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
