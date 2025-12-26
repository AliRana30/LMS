"use client";
import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { redirect } from "next/navigation";
import React, { FC, useEffect, use, useState } from "react";
import { toast } from "react-hot-toast";
import CourseContent from "../../components/Course/CourseContent";
import Header from "@/app/components/Header";
import { useTheme } from "next-themes";
import Heading from "@/app/utils/Heading";

type Props = {
  params: Promise<{ id: string }>;
};

const Page: FC<Props> = ({ params }) => {
  const { id } = use(params);
  const { data, isLoading, error } = useLoadUserQuery({});
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [activeItem, setactiveItem] = useState(1)
  const [route, setRoute] = useState("login")

  useEffect(() => {
    if (data) {
      const isPurchased = data.user?.courses?.find(
        (course: any) => course._id === id
      );

      if (!isPurchased) {
        redirect("/");
      }
    }

    if (error) {
      if ("data" in error) {
        const errMsg = (error.data as any).message;
        toast.error(errMsg);
        redirect("/");
      }
    }
  }, [data, error, id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      <Heading title="Campus Core" description="CampusCore is a platform for the students to learn and get help from teachers"
        keywords="Programming,MERN,Learning,Full-Stack" />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
      <CourseContent id={id} user={data?.user} />
    </div>
  );
};

export default Page;
