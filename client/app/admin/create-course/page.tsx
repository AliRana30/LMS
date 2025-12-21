"use client"
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import CreateCourse from '../../components/Admin/Course/CreateCourse'
import AdminLayout from '@/app/components/Admin/AdminLayout'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
     <div className=''>
        <AdminProtected>
         <Heading 
           title={`Create Course - CampusCore`} 
           description="CampusCore is a platform for the students to learn and get help from teachers"
           keywords="Programming,MERN,Learning,Full-Stack"  
         />
         <AdminLayout>
           <CreateCourse/>
         </AdminLayout>
       </AdminProtected>
    </div>
  )
}

export default page