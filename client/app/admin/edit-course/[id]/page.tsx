"use client"
import { use } from 'react'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import EditCourse from '../../../components/Admin/Course/EditCourse'
import AdminLayout from '@/app/components/Admin/AdminLayout'

type Props = {
  params: Promise<{ id: string }>
}

const Page = ({ params }: Props) => {
  const { id } = use(params)

  return (
    <div className=''>
      <AdminProtected>
        <Heading 
          title="Edit Course - Emulate" 
          description="Emulate is a platform for the students to learn and get help from teachers"
          keywords="Programming,MERN,Learning,Full-Stack"  
        />
        <AdminLayout>
          <EditCourse id={id}/>
        </AdminLayout>
      </AdminProtected>
    </div>
  )
}

export default Page