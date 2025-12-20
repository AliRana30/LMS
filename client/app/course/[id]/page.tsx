import CourseDetailsPage from "@/app/components/Course/CourseDetailsPage"


const page = async ({params} : any) => {
  const resolvedParams = await params;
  return (
    <div>
        <CourseDetailsPage id={resolvedParams.id}/>
    </div>
  )
}

export default page