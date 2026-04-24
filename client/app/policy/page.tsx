"use client"
import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import Header from '../components/Header'
import Heading from '../utils/Heading'
import Footer from '../components/Footer'
import Policy from '../components/Policy/Policy'

const PolicyPage = () => {
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(3)
  const [route, setRoute] = useState("login")

  return (
    <div className={`min-h-screen transition-colors duration-300 ${resolvedTheme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      <Heading
        title="Privacy Policy - CampusCore"
        description="Read our privacy policy, terms of service, and data protection policies"
        keywords="Privacy Policy, Terms of Service, Data Protection, CampusCore"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <Policy theme={resolvedTheme} />
      <Footer />
    </div>
  )
}

export default PolicyPage
