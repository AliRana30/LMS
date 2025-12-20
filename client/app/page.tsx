"use client"
import { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Courses from "./components/Course/Courses";
import Reviews from "./components/Reviews/Reviews";
import FAQ from "./components/FAQ/FAQ";
import Footer from "./components/Footer";
import { useTheme } from "next-themes";

interface Props {

}

const Page: FC<Props> = (props) => {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [activeItem, setactiveItem] = useState(0)
  const [route, setRoute] = useState("Login")

  return (
    <div className="min-h-screen">
      <Heading title="Campus Core" description="CampusCore is a platform for the students to learn and get help from teachers"
        keywords="Programming,MERN,Learning,Full-Stack" />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer/>
    </div>
  )
}

export default Page;