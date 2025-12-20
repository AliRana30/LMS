"use client"
import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi'
import React , {FC, useEffect, useState} from 'react'
import Loader from '../Loader/Loader'
import Heading from '@/app/utils/Heading'
import Header from '../Header'
import Footer from '../Footer'
import CourseDetails from './CourseDetails'
import { loadStripe } from '@stripe/stripe-js'
import { useCreatePaymentIntentMutation, useGetStripePublishableKeyQuery } from '@/redux/features/orders/orderApi'

type Props = {
  id: string
}

const CourseDetailsPage : FC<Props> = ({id}) => {
  const [route , setRoute] = useState("Login")
  const [open , setOpen] = useState(false)
  const {data , isLoading} = useGetCourseDetailsQuery(id)
  const {data : config} = useGetStripePublishableKeyQuery({})
  const [createPaymentIntent , {data : paymentIntentData}] = useCreatePaymentIntentMutation({})
  const [stripePromise , setStripePromise] = useState<any>(null)
  const [clientSecret , setClientSecret] = useState('')
  
  useEffect(()=>{
      if(config){
        const publishableKey = config.publishableKey
        setStripePromise(loadStripe(publishableKey))
      }
      if(data){
        const amount = Math.round(data?.course.price * 100)
        createPaymentIntent(amount)
      }
  },[data,config])

  useEffect(()=>{
      if(paymentIntentData){
        setClientSecret(paymentIntentData?.client_secret)
      }
  },[paymentIntentData])

  if(isLoading){
    return <Loader/>
  }
  
  return (
    <div>
      <Heading title={data?.course.name + " - CampusCore"}  description={data?.course.description} keywords={data?.course?.tags} />
      <Header route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1}/>
      {
        <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret} setRoute={setRoute} setOpen={setOpen}/>
      }
      <Footer/>
    </div>
  )
}

export default CourseDetailsPage