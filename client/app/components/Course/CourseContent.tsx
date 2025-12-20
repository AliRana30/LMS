"use client";
import Heading from "@/app/utils/Heading";
import { useGetCourseContentQuery, useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import React, { FC, useEffect, useState } from "react";
import CourseContentMedia from "./CourseContentMedia";
import Loader from "../Loader/Loader";
import CourseContentList from "./CourseContentList";

type Props = {
  id: string;
  user: any
};

const CourseContent: FC<Props> = ({ id, user }) => {
  const { data: contentData, isLoading: contentLoading, refetch: refetchContent } = useGetCourseContentQuery(id, { refetchOnMountOrArgChange: true });
  const { data: courseDetails, isLoading: detailsLoading, refetch: refetchDetails } = useGetCourseDetailsQuery(id, { refetchOnMountOrArgChange: true });
  
  const data = contentData?.content || [];
  const courseData = courseDetails?.course || {};

  const [activeVideo, setActiveVideo] = useState(0);

  const refetch = () => {
    refetchContent();
    refetchDetails();
  };

  if (contentLoading || detailsLoading) return <Loader />;

  return (
    <div>
      <Heading
        title={data[activeVideo]?.title || "Untitled"}
        description="anything"
        keywords={data[activeVideo]?.tags || []}
      />

      <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-7">
          <CourseContentMedia
            id={id}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
            data={data}
            courseData={courseData}
            user={user}
            refetch={refetch}
          />
        </div>

        <div className="lg:col-span-3">
          <CourseContentList 
            setActiveVideo={setActiveVideo} 
            activeVideo={activeVideo} 
            data={data} 
          />
        </div>
      </div>
    </div>
  );
};

export default CourseContent;