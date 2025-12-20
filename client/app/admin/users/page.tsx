"use client";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AllUsers from "../../components/Admin/Course/AllUsers";
import React from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="w-full min-h-screen">
      <AdminProtected>
        <Heading
          title="Admin Dashboard - CampusCore"
          description="CampusCore is a platform for the students to learn and get help from teachers"
          keywords="Programming,MERN,Learning,Full-Stack"
        />

        <div className="flex w-full min-h-screen">
          <aside className="w-[280px] h-screen sticky top-0 overflow-y-auto border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900">
            <AdminSidebar user={user} />
          </aside>

          <main className="flex-1 min-h-screen overflow-x-hidden bg-gray-50 dark:bg-slate-950">
              <DashboardHero />
            <div className="h-full  ml-4 mr-4">
              <AllUsers />
            </div>
          </main>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page;