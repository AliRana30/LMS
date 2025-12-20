"use client"
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { BiMoon, BiSun } from 'react-icons/bi'

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='w-[40px] h-[40px]' />
    )
  }

  return (
    <div className='flex items-center justify-center mx-4'>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`
          relative w-[40px] h-[40px] rounded-full flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${theme === "dark" 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg' 
            : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 shadow-md'
          }
          hover:scale-110 active:scale-95
        `}
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? (
          <BiMoon
            className='transition-transform duration-300'
            fill='black'
            size={22}
          />
        ) : (
          <BiSun
            className='transition-transform duration-300 animate-pulse'
            fill='#FDB813'
            size={22}
          />
        )}
      </button>
    </div>
  )
}

export default ThemeSwitcher