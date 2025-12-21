"use client"
import CoursePlayer from '@/app/utils/CoursePlayer'
import Ratings from '@/app/utils/Ratings'
import CourseContentList from '../Course/CourseContentList'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { format } from 'timeago.js'
import { useTheme } from 'next-themes'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../Payment/CheckoutForm'
import Image from 'next/image'

type Props = {
    data: any
    stripePromise?: any
    clientSecret?: string
    setRoute : any
    setOpen : any
}

const CourseDetails: FC<Props> = ({ data, stripePromise, clientSecret, setRoute, setOpen : openAuthModal}) => {
    const { theme } = useTheme()
    const { user } = useSelector((state: any) => state.auth)
    const [open, setOpen] = useState(false);
    const discountPercentage = data?.estimatedPrice && data?.price ? Math.round(((data.estimatedPrice - data.price) / data.estimatedPrice) * 100) : 0
    const isPurchased = user && user?.courses?.find((course: any) => course._id === data._id)

    const handleOrder = (e: any) => {
        console.log("Buy Now clicked - User:", user ? user.name : "Not logged in");
        if(user){
            setOpen(true);
        }
        else{
            console.log("Opening login modal");
            openAuthModal(true)
            setRoute("Login")
        }
    }

    return (
        <div className={`w-full min-h-screen transition-colors duration-300 font-poppins ${theme === 'dark'
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
            }`}>
            <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8 mt-14">
                        <h1 className={`text-1xl md:text-2xl lg:text-3xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            {data.name}
                        </h1>

                        {/* Ratings and Stats */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Ratings rating={data.ratings} />
                            <h5 className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {data.reviews?.length} Reviews
                            </h5>
                            <h5 className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {data.purchased} Students
                            </h5>
                        </div>

                        {/* What You'll Learn */}
                        <div className="mt-8">
                            <h1 className={`text-1xl md:text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                What you will learn from this course?
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data?.benefits?.map((benefit: any, index: number) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <IoMdCheckmarkCircleOutline className="text-[#37a39a] text-xl flex-shrink-0 mt-1" />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {benefit?.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Prerequisites */}
                        <div className="mt-8">
                            <h1 className={`text-1xl md:text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                What are the prerequisites for starting this course?
                            </h1>
                            <div className="space-y-3">
                                {data?.prerequisites?.map((prerequisite: any, index: number) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <IoMdCheckmarkCircleOutline className="text-[#37a39a] text-xl flex-shrink-0 mt-1" />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {prerequisite?.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Overview */}
                        <div className="mt-8">
                            <h1 className={`text-1xl md:text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                Course Overview
                            </h1>
                            <CourseContentList data={data?.courseData} isDemo={true} />
                        </div>

                        {/* Course Description */}
                        <div className="mt-8">
                            <h1 className={`text-1xl md:text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                Course Details
                            </h1>
                            <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {data.description}
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Ratings rating={data.ratings} />
                                <h5 className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {Number.isInteger(data?.ratings) ? data?.ratings : data?.ratings.toFixed(1)} out of 5 Course Rating • {data?.reviews?.length} Reviews
                                </h5>
                            </div>

                            <div className="space-y-6">
                                {data?.reviews && [...data.reviews].reverse().map((review: any, index: number) => (
                                    <div key={index} className={`pb-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                        }`}>
                                        
                                        <div className="mb-3">
                                            <Image
                                            src={review.user?.avatar?.url || "/noimage.png"}
                                            width={30}
                                            height={30}
                                            alt='User Avatar'
                                            className="rounded-full"
                                        />
                                            <h5 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {review.user.name}
                                            </h5>
                                            <Ratings rating={review.rating} />
                                        </div>
                                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                            {review.comment}
                                        </p>
                                        <small className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {format(review.createdAt)}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Video & Purchase */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Video Player */}
                            <div className="mb-6">
                                <CoursePlayer videoUrl={data.demoUrl} title={data?.title} />
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {data.price == 0 ? "Free" : data?.price + "$"}
                                    </h1>
                                    {data.estimatedPrice && data.price !== 0 && (
                                        <h5 className={`text-xl line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                            }`}>
                                            {data.estimatedPrice}$
                                        </h5>
                                    )}
                                </div>
                                {discountPercentage > 0 && (
                                    <h4 className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                                        {discountPercentage}% off
                                    </h4>
                                )}
                            </div>

                            {/* CTA Button */}
                            <div className="mb-6">
                                {isPurchased ? (
                                    <Link
                                        href={`/course-access/${data._id}`}
                                        className="block w-full py-3 bg-[#37a39a] text-white text-center rounded-full font-bold text-lg hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform "
                                    >
                                        Enter to Course
                                    </Link>
                                ) : user?.role !== "admin" ? (
                                    <div
                                        onClick={handleOrder}
                                        className="w-full py-2 bg-[#37a39a] text-white text-center rounded-full font-bold text-lg hover:bg-[#2d8b7f] transition-all duration-300 shadow-lg hover:shadow-xl transform cursor-pointer"
                                    >
                                        Buy Now {data.price}$
                                    </div>
                                ) : null}
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                                <p className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    <IoMdCheckmarkCircleOutline className="text-[#37a39a] text-lg flex-shrink-0" />
                                    Source Code Included
                                </p>
                                <p className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    <IoMdCheckmarkCircleOutline className="text-[#37a39a] text-lg flex-shrink-0" />
                                    Lifetime Access
                                </p>
                                <p className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    <IoMdCheckmarkCircleOutline className="text-[#37a39a] text-lg flex-shrink-0" />
                                    Experts Support
                                </p>
                                <p className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    <IoMdCheckmarkCircleOutline className="text-[#37a39a] text-lg flex-shrink-0" />
                                    Certification of Completion
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {open && (
                <div className='w-full h-screen fixed top-0 left-0 bg-[#00000036] flex items-center justify-center z-50'>
                    <div className='w-[400px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl relative'>
                        <div className='w-full flex justify-end p-3'>
                            <IoMdCloseCircleOutline
                                size={30}
                                className='text-black dark:text-white cursor-pointer hover:text-red-500 transition-colors'
                                onClick={() => setOpen(false)}
                            />
                        </div>
                        <div className="w-full px-6 pb-6">
                            {stripePromise && clientSecret ? (
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <CheckoutForm setOpen={setOpen} data={data} user={user} />
                                </Elements>
                            ) : (
                                <p className="text-center text-gray-600 dark:text-gray-400">
                                    Loading payment form...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseDetails