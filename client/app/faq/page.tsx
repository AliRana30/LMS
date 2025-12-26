"use client"
import { FC, useState } from "react";
import { useTheme } from "next-themes";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import FAQ from "../components/FAQ/FAQ";
import Footer from "../components/Footer";

interface Props {

}

const Page: FC<Props> = (props) => {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [activeItem, setactiveItem] = useState(4)
  const [route, setRoute] = useState("login")

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      <Heading title="Campus Core" description="CampusCore is a platform for the students to learn and get help from teachers"
        keywords="Programming,MERN,Learning,Full-Stack" />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute} />
      <FAQ />
      <Footer />
    </div>
  )
}

export default Page;