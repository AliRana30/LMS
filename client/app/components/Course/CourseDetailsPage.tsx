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
    if (config?.publishableKey) {
      const publishableKey = config.publishableKey
      setStripePromise(loadStripe(publishableKey))
    }
  }, [config])

  // Create payment intent only when user is logged in and course has a price
  useEffect(() => {
    if (data?.course && user && data.course.price > 0) {
      const amount = Math.round(data.course.price * 100)
      createPaymentIntent(amount)
    }
  }, [data, user, createPaymentIntent])

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.client_secret)
    }
  }, [paymentIntentData])

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