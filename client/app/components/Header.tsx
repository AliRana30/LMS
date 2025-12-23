"use client"
import React, { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import NavItems from '../utils/NavItems'
import { ThemeSwitcher } from '../utils/ThemeSwitcher'
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import CustomModal from '../utils/CustomModal'
import Login from './Auth/Login'
import Signup from './Auth/Signup'
import Verification from './Auth/Verification'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useLogoutQuery, useSocialAuthMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'
import { useTheme } from 'next-themes'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  activeItem: number
  route: string
  setRoute: (route: string) => void
}

const Header: FC<Props> = ({ activeItem, open, setOpen, route, setRoute }) => {
  const { theme } = useTheme()
  const [active, setactive] = useState(false)
  const [openSideBar, setopenSideBar] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useSelector((state: any) => state.auth)
  const [logout, setLogout] = useState(false)

  const { data, status } = useSession()
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation()
  const {} = useLogoutQuery(undefined, { skip: !logout ? true : false })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setactive(true)
      } else {
        setactive(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Handle sidebar close
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setopenSideBar(false)
    }
  }

  // Handle social authentication
  useEffect(() => {
    if (!user && status === "authenticated" && data?.user) {
      socialAuth({
        email: data.user.email || '',
        name: data.user.name || '',
        avatar: data.user.image || ''
      })
    }
  }, [data, user, status, socialAuth])

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successful")
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      if ('data' in error) {
        const errMsg = (error.data as any)?.message || "Login failed"
        toast.error(errMsg)
      } else {
        toast.error("An error occurred during login")
      }
    }
  }, [error])

  if (!mounted) {
    return null
  }

  return (
    <div className='w-full relative font-poppins'>
      <div className={`fixed w-full h-[68px] z-[80] border-b transition-all duration-300 ${
        active
          ? theme === 'dark'
            ? 'bg-gray-900/95 border-gray-700 backdrop-blur-sm shadow-xl'
            : 'bg-white/95 border-gray-200 backdrop-blur-sm shadow-xl'
          : theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
      }`}>
        <div className='w-[95%] md:w-[92%] mx-auto h-full'>
          <div className='w-full h-full flex items-center justify-between'>
            <Link href="/" className='flex items-center'>
              <h1 className={`text-[20px] sm:text-[22px] md:text-[25px] font-poppins font-semibold cursor-pointer hover:text-[#37a39a] transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                CampusCore
              </h1>
            </Link>

            {/* Desktop Navigation Items */}
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='hidden md:flex'>
                <NavItems activeItem={activeItem} isMobile={false} />
              </div>

              {/* Theme Switcher - Show on all sizes */}
              <ThemeSwitcher />

              {/* Profile Icon - Show on all sizes */}
              {user ? (
                user?.avatar?.url ? (
                  <Link href="/profile">
                    <Image
                      src={user.avatar.url}
                      alt={user.name || 'User avatar'}
                      width={35}
                      height={35}
                      className='w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] rounded-full cursor-pointer border-2 border-[#37a39a] hover:border-[#2d8f82] transition-all duration-300'
                      style={{ objectFit: 'cover' }}
                      unoptimized
                      key={user.avatar.url}
                    />
                  </Link>
                ) : (
                  <Link href="/profile">
                    <HiOutlineUserCircle
                      size={35}
                      className={`cursor-pointer hover:text-[#37a39a] transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    />
                  </Link>
                )
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className={`cursor-pointer hover:text-[#37a39a] transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  onClick={() => {
                    setOpen(true)
                    setRoute("login")
                  }}
                />
              )}

              {/* Mobile Menu Icon */}
              <div className='md:hidden'>
                <HiOutlineMenuAlt3
                  size={25}
                  className={`cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  onClick={() => setopenSideBar(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {openSideBar && (
        <div
          className='fixed w-full h-screen top-0 left-0 z-[99999] bg-black/50'
          onClick={handleClose}
          id="screen"
        >
          <div className={`w-[75%] sm:w-[60%] fixed z-[999999999] h-screen top-0 right-0 transition-all duration-300 shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
              : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
          }`}>
            <div className='w-full flex justify-end pt-5 pr-5'>
              <AiOutlineClose
                size={25}
                className={`cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                onClick={() => setopenSideBar(false)}
              />
            </div>
            <div className='w-full flex flex-col items-center justify-start pt-8 px-4 h-full overflow-y-auto'>
              {/* User Profile in Mobile Menu */}
              {user && (
                <Link 
                  href="/profile" 
                  className={`mb-8 flex flex-col items-center gap-3 hover:text-[#37a39a] transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  onClick={() => setopenSideBar(false)}
                >
                  {user?.avatar?.url ? (
                    <Image
                      src={user.avatar.url}
                      alt={user.name || 'User avatar'}
                      unoptimized
                      key={user.avatar.url}
                      width={60}
                      height={60}
                      className='rounded-full border-2 border-[#37a39a]'
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <HiOutlineUserCircle size={60} />
                  )}
                  <span className='font-poppins text-base font-semibold'>{user?.name || 'Profile'}</span>
                </Link>
              )}

              {/* Mobile Navigation Items */}
              <NavItems activeItem={activeItem} isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {open && (
        <CustomModal 
          open={open} 
          setOpen={setOpen} 
          setRoute={setRoute} 
          component={
            route === "login" ? Login : 
            route === "signup" ? Signup : 
            route === "verification" ? Verification : 
            Login
          } 
          activeItem={activeItem} 
          route={route} 
        />
      )}
    </div>
  )
}

export default Header