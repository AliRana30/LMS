import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

type Props = {}

const FAQ = (props: Props) => {
  const { theme } = useTheme()
  const { data, isLoading } = useGetHeroDataQuery("FAQ", { refetchOnMountOrArgChange: true })
  const [questions, setQuestions] = useState<any[]>([])
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  
  const toggleQuestion = (index: number) => {
    if (activeQuestion === index) {
      setActiveQuestion(null)
    } else {
      setActiveQuestion(index)
    }
  }

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq)
    }
  }, [data])

  return (
    <div className={`w-full min-h-screen pt-[80px] pb-20 font-poppins transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`} suppressHydrationWarning>
      <div className='w-[95%] md:w-[85%] lg:w-[75%] mx-auto mt-10'>
        <div className='text-center mb-12'>
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find answers to common questions about our courses and platform
          </p>
        </div>

        {isLoading ? (
          <div className='space-y-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`p-6 rounded-xl animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className='h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2'></div>
                <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4'></div>
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {questions && questions.map((item: any, index: number) => (
              <div
                key={index}
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className='cursor-pointer w-full p-6 flex items-center justify-between text-left hover:bg-opacity-80 transition-all duration-300'
                >
                  <h3 className={`text-lg md:text-xl font-semibold pr-4 cursor-pointer ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.question}
                  </h3>
                  <svg
                    className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                      activeQuestion === index ? 'transform rotate-180' : ''
                    } ${theme === 'dark' ? 'text-[#37a39a]' : 'text-[#37a39a]'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeQuestion === index ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`p-6 pt-0 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`text-base leading-relaxed mt-5 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FAQ