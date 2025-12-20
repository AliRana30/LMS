"use client"
import AdminSidebar from '@/app/components/Admin/sidebar/AdminSidebar'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import CreateCourse from '../../components/Admin/Course/CreateCourse'
import React from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const page = (props: Props) => {
   const {user} = useSelector((state : any)=> state.auth)
  return (
     <div className=''>
        <AdminProtected>
         <Heading 
           title={`Create Course - CampusCore`} 
           description="CampusCore is a platform for the students to learn and get help from teachers"
           keywords="Programming,MERN,Learning,Full-Stack"  
         />
         <div className="flex">
           <div className="w-1/5 min-h-screen">
              <AdminSidebar user={user}/>
           </div>
           <div className="w-4/5">
              <CreateCourse/>
           </div>
         </div>
       </AdminProtected>
    </div>
  )
}

export default page