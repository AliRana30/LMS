"use client"
import React, { FC } from 'react'
import { IoMdCheckmark } from 'react-icons/io'
import { useTheme } from 'next-themes'

type Props = {
    active: number
    setActive: (active: number) => void
}

const CourseOptions: FC<Props> = ({active, setActive}) => {
    const { theme } = useTheme()
    const options = [
        "Course Information",
        "Course Options",
        "Course Content",
        "Course Preview"
    ]
    
    return (
        <div className="w-full py-6 px-4 font-poppins">
            <h3 className={`text-lg font-bold mb-6 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
                Create Course
            </h3>
            
            <div className="flex flex-col space-y-4">
                {options.map((option, index) => (
                    <div key={index} className="relative">
                        <div 
                            className="flex items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setActive(index)}
                        >
                            <div className="flex flex-col items-center">
                                <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                                        active > index 
                                            ? 'bg-teal-600' 
                                            : active === index 
                                            ? 'bg-blue-600' 
                                            : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                                    }`}
                                >
                                    {active > index ? (
                                        <IoMdCheckmark className="text-xl" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                
                                {/* Connecting line */}
                                {index !== options.length - 1 && (
                                    <div className="w-0.5 h-12 my-1 transition-all duration-300" style={{
                                        backgroundColor: active > index 
                                            ? '#22c55e' 
                                            : theme === 'dark' ? '#4b5563' : '#d1d5db'
                                    }} />
                                )}
                            </div>
                            
                            {/* Label */}
                            <div className="flex-1 pt-2">
                                <h5 className={`text-sm font-medium transition-all duration-300 ${
                                    active === index 
                                        ? 'text-blue-600 font-bold' 
                                        : active > index
                                        ? 'text-teal-600 font-semibold'
                                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {option}
                                </h5>
                                
                                {/*  status text */}
                                <p className={`text-xs mt-1 ${
                                    active > index 
                                        ? 'text-teal-600' 
                                        : active === index
                                        ? 'text-blue-500'
                                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                    {active > index ? 'Completed' : active === index ? 'In Progress' : 'Pending'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 pt-6 border-t" style={{
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
            }}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Progress
                    </span>
                    <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {Math.round((active / (options.length - 1)) * 100)}%
                    </span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                    <div 
                        className="h-full bg-blue-700 transition-all duration-300"
                        style={{ width: `${(active / (options.length - 1)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CourseOptions