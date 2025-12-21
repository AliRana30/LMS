"use client";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AllCourses from "../../components/Admin/Course/AllCourses";
import AdminLayout from "@/app/components/Admin/AdminLayout";
import React from "react";

const Page = () => {
  return (
    <div className="w-full min-h-screen">
      <AdminProtected>
        <Heading
          title="All Courses - CampusCore"
          description="CampusCore is a platform for the students to learn and get help from teachers"
          keywords="Programming,MERN,Learning,Full-Stack"
        />
        <AdminLayout>
          <AllCourses />
        </AdminLayout>
      </AdminProtected>
    </div>
  );
};

export default Page;