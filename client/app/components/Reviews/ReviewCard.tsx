import React, { FC } from 'react'
import { useTheme } from 'next-themes'

type Props = {
  review: any
}

const ReviewCard: FC<Props> = ({ review }) => {
  const { theme } = useTheme()

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFA500" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        )
      }
    }
    return <div className='flex gap-0.5'>{stars}</div>
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className='flex items-center gap-4 mb-4'>
        <img 
          src={review.avatar} 
          alt={review.name}
          className='w-16 h-16 rounded-full object-cover border-4 border-[#37a39a]'
        />
        <div className='flex-1'>
          <h3 className={`font-bold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {review.name}
          </h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {review.profession}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between mb-3'>
        {renderStars(review.rating)}
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {review.date}
        </span>
      </div>

      <p className={`text-sm leading-relaxed ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        "{review.comment}"
      </p>
    </div>
  )
}

export default ReviewCard