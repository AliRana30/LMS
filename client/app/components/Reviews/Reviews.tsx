import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useTheme } from 'next-themes'

type Props = {}

const Reviews = (props: Props) => {
  const { theme } = useTheme()
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=6')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        
        const formattedReviews = data.results.map((user: any) => ({
          name: `${user.name.first} ${user.name.last}`,
          avatar: user.picture.large,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: getRandomComment(),
          profession: getRandomProfession(),
          date: getRandomDate()
        }))
        
        setReviews(formattedReviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Fallback to static reviews if API fails
        const fallbackReviews = Array.from({ length: 6 }, (_, i) => ({
          name: `Student ${i + 1}`,
          avatar: `https://ui-avatars.com/api/?name=Student+${i + 1}&background=37a39a&color=fff&size=200`,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: getRandomComment(),
          profession: getRandomProfession(),
          date: getRandomDate()
        }))
        setReviews(fallbackReviews)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const getRandomComment = () => {
    const comments = [
      "This course completely transformed my career! The instructors are knowledgeable and the content is top-notch.",
      "Excellent learning experience. The practical examples really helped me understand the concepts.",
      "Best investment I've made in my education. Highly recommend to anyone looking to upskill.",
      "The course structure is perfect for beginners and advanced learners alike. Very satisfied!",
      "Outstanding content delivery and support from the instructors. Worth every penny!",
      "I've taken many online courses, but this one stands out. Clear explanations and real-world projects."
    ]
    return comments[Math.floor(Math.random() * comments.length)]
  }

  const getRandomProfession = () => {
    const professions = [
      "Software Developer",
      "Data Scientist",
      "Product Manager",
      "UI/UX Designer",
      "Marketing Manager",
      "Business Analyst"
    ]
    return professions[Math.floor(Math.random() * professions.length)]
  }

  const getRandomDate = () => {
    const dates = [
      "2 days ago",
      "1 week ago",
      "2 weeks ago",
      "1 month ago",
      "2 months ago",
      "3 months ago"
    ]
    return dates[Math.floor(Math.random() * dates.length)]
  }

  return (
    <div className={`w-full min-h-screen pt-[80px] pb-20 font-poppins transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`} suppressHydrationWarning>
      <div className='w-[95%] md:w-[85%] mx-auto'>
        <div className='text-center mb-12'>
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            What Our Students Say
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of satisfied learners who have transformed their careers
          </p>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`p-6 rounded-xl animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full'></div>
                  <div className='flex-1'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2'></div>
                    <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3'></div>
                  </div>
                </div>
                <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2'></div>
                <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2'></div>
                <div className='h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4'></div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {reviews && reviews.map((review: any, index: number) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews