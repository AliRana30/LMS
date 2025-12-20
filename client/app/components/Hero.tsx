"use client"
import React, { useState, useEffect } from 'react'
import { BiSearch } from 'react-icons/bi'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const Hero = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data } = useGetHeroDataQuery("Banner", { refetchOnMountOrArgChange: true })
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (search === '' || search.trim() === '') {
      toast.error('Please enter a search term');
      return;
    }
    
    router.push(`/courses?title=${search}`)
  }

  if (!mounted || !data?.layout?.banner?.image?.url) {
    return (
      <div className='w-full h-[100vh] flex items-center justify-center pt-[120px]'>
        <div className='w-[95%] md:w-[85%] mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div className='flex items-center justify-center order-2 md:order-1'>
              <div className='relative w-full max-w-[500px] h-[400px] md:h-[500px]'>
                <div className='animate-pulse w-full h-full bg-gray-200 dark:bg-gray-800 rounded-full'></div>
              </div>
            </div>
            <div className='flex flex-col gap-6 order-1 md:order-2'>
              <div className='h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen flex items-center justify-center pt-[120px] pb-[60px] transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className='w-[95%] md:w-[85%] mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center'>
          
          <div className='flex items-center justify-center order-2 md:order-1'>
            <div className='relative w-full max-w-[500px] h-[400px] md:h-[500px]'>
              <div className='absolute inset-0 dark:bg-[#37a39a]/20 bg-[#37a39a]/10 rounded-full blur-3xl animate-pulse'></div>
              <div className='relative z-10 w-full h-full flex items-center justify-center'>
                <div className='relative w-[380px] h-[380px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden shadow-2xl animate-float'>
                  <Image
                    src={data.layout.banner.image.url}
                    alt='Student learning'
                    fill
                    className='object-cover'
                    priority
                    style={{ mixBlendMode: theme === 'dark' ? 'lighten' : 'normal' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-20px);
              }
            }
            
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `}</style>

          <div className='flex flex-col gap-6 order-1 md:order-2'>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {data.layout.banner.title || 'Explore All Courses & Start Learning'} 
            </h1>

            <p className={`text-lg md:text-xl font-poppins leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {data.layout.banner.subTitle || 'Discover thousands of courses taught by expert instructors. Learn at your own pace and advance your career with CampusCore.'}
            </p>

            <form onSubmit={handleSearch} className='relative w-full max-w-[600px]'>
              <div className='relative flex items-center'>
                <BiSearch 
                  className={`absolute left-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  size={24} 
                />
                <input
                  type='text'
                  placeholder='Search for courses....'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-full border-2 focus:outline-none focus:border-[#37a39a] transition-all duration-300 font-poppins shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  type='submit'
                  className='absolute right-2 px-6 py-2 bg-[#37a39a] text-white rounded-full font-poppins font-semibold hover:bg-[#2d8b7f] transition-all duration-300 shadow-md'
                >
                  Search
                </button>
              </div>
            </form>

            <div className='flex flex-wrap gap-8 mt-4'>
              <div className='flex flex-col'>
                <span className={`text-3xl font-bold font-poppins ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>10+</span>
                <span className='text-sm dark:text-gray-400 text-gray-600 font-poppins'>Online Courses</span>
              </div>
              <div className='flex flex-col'>
                <span className={`text-3xl font-bold font-poppins ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>10+</span>
                <span className='text-sm dark:text-gray-400 text-gray-600 font-poppins'>Expert Tutors</span>
              </div>
              <div className='flex flex-col'>
                <span className={`text-3xl font-bold font-poppins ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>10K+</span>
                <span className='text-sm dark:text-gray-400 text-gray-600 font-poppins'>Happy Students</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-2'>
              <Link href='/courses'>
                <button className='px-8 py-4 bg-[#37a39a] text-white rounded-full font-poppins font-semibold hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'>
                  Browse Courses
                </button>
              </Link>
              <Link href='/about'>
                <button className={`px-8 py-4 rounded-full font-poppins font-semibold border-2 hover:border-[#37a39a] transition-all duration-300 shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white border-gray-700' 
                    : 'bg-white text-gray-900 border-gray-200'
                }`}>
                  Learn More
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero