import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center min-h-screen '>
      <div className='relative'>
        {/* Outer rotating ring */}
        <div className='w-20 h-20 border-4 border-gray-200 dark:border-gray-800 border-t-[#37a39a] rounded-full animate-spin'></div>
        
        {/* Inner pulsing circle */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='w-12 h-12 bg-[#37a39a] rounded-full animate-pulse opacity-75'></div>
        </div>
        
        {/* Center dot */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='w-4 h-4 bg-white dark:bg-black rounded-full'></div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className='absolute mt-32'>
        <p className='text-lg font-poppins text-gray-700 dark:text-white animate-pulse'>
          Loading...
        </p>
      </div>
    </div>
  )
}

export default Loader