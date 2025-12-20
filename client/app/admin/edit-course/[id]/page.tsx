"use client"
import { use } from 'react'
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import { useSelector } from 'react-redux'
import EditCourse from '../../../components/Admin/Course/EditCourse'

type Props = {
  params: Promise<{ id: string }>
}

const Page = ({ params }: Props) => {
  const { id } = use(params)
  const { user } = useSelector((state: any) => state.auth)

  return (
    <div className=''>
      <AdminProtected>
        <Heading 
          title={`Edit Course - CampusCore`} 
          description="CampusCore is a platform for the students to learn and get help from teachers"
          keywords="Programming,MERN,Learning,Full-Stack"  
        />
        <div className="flex">
          <div className="w-1/5 min-h-screen">
            <AdminSidebar user={user}/>
          </div>
          <div className="w-4/5">
            <EditCourse id={id}/>
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default Page