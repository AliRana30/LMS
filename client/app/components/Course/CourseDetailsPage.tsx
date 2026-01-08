"use client"
import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi'
import React, { FC, useEffect, useState } from 'react'
import Loader from '../Loader/Loader'
import Heading from '@/app/utils/Heading'
import Header from '../Header'
import Footer from '../Footer'
import CourseDetails from './CourseDetails'
import { loadStripe } from '@stripe/stripe-js'
import { useCreatePaymentIntentMutation, useGetStripePublishableKeyQuery } from '@/redux/features/orders/orderApi'
import { useSelector } from 'react-redux'

type Props = {
  id: string
}

const CourseDetailsPage: FC<Props> = ({ id }) => {
  const [route, setRoute] = useState("login")
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useGetCourseDetailsQuery(id)
  const { data: config, isLoading: configLoading, error: configError } = useGetStripePublishableKeyQuery({})
  const [createPaymentIntent, { data: paymentIntentData, error: paymentError }] = useCreatePaymentIntentMutation({})
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState('')
  const { user } = useSelector((state: any) => state.auth)

  // Initialize Stripe Promise when config is available
  useEffect(() => {
    if (configError) {
      console.error('Stripe config error:', configError)
      const errorData = configError as any
      if (errorData?.data?.message) {
        console.error('Error message:', errorData.data.message)
      }
    }
    if (config?.publishableKey) {
      console.log('Stripe publishable key loaded successfully')
      const publishableKey = config.publishableKey
      setStripePromise(loadStripe(publishableKey))
    } else if (!configLoading && !config) {
      console.warn('No Stripe config available and not loading')
    }
  }, [config, configError, configLoading])

  // Create payment intent only when user is logged in and course has a price
  useEffect(() => {
    if (data?.course && user && data.course.price > 0) {
      const amount = Math.round(data.course.price * 100)
      console.log('Creating payment intent for amount:', amount, 'User:', user?.name)
      createPaymentIntent(amount)
    } else {
      if (data?.course) {
        console.log('Payment intent conditions:', {
          hasCourse: !!data?.course,
          hasUser: !!user,
          price: data.course.price,
          shouldCreateIntent: data.course.price > 0
        })
      }
    }
  }, [data, user, createPaymentIntent])

  useEffect(() => {
    if (paymentError) {
      console.error('Payment intent error:', paymentError)
      const errorData = paymentError as any
      if (errorData?.data?.message) {
        console.error('Error message:', errorData.data.message)
      }
    }
    if (paymentIntentData) {
      console.log('Payment intent created successfully')
      setClientSecret(paymentIntentData?.client_secret)
    }
  }, [paymentIntentData, paymentError])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>
      <Heading title={data?.course.name + " - CampusCore"} description={data?.course.description} keywords={data?.course?.tags} />
      <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1} />
      {
        <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret} setRoute={setRoute} setOpen={setOpen} />
      }
      <Footer />
    </div>
  )
}

export default CourseDetailsPage