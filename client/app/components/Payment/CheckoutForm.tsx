import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import { useCreateOrderMutation } from '@/redux/features/orders/orderApi'
import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement
} from '@stripe/react-stripe-js'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import socketIO from "socket.io-client"
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: (open: boolean) => void 
  data: any
  user : any
}

const CheckoutForm = ({ setOpen, data, user }: Props) => {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string>("")
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation()
  const [loadUser, setLoadUser] = useState(false)
  const {refetch } = useLoadUserQuery(undefined, { skip: !loadUser })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setMessage("Payment system not ready. Please try again.")
      return
    }

    setLoading(true)
    setMessage("Processing your payment...")

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: "if_required"
      })

      if (stripeError) {
        setMessage(stripeError.message || "Payment failed. Please try again.")
        setLoading(false)
        return
      }

      if (paymentIntent?.status === "succeeded") {
        // Create order after successful payment
        await createOrder({
          courseId: data?._id,
          payment_info: paymentIntent,
        })

        setLoadUser(true)
      }
    } catch (err) {
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(orderData){
        setLoadUser(true);
        setMessage("Payment successful! Redirecting...");

        socketId.emit("notification", {
          title : "New Order",
          message: `You have new order from ${user?.name} for the course ${orderData?.name}.`,
          userId: user._id,
        });

        refetch().then(() => {
          setTimeout(() => {
            setOpen(false);
            redirect(`/course-access/${data._id}`);
          }, 1500);
        });
    }
    if(error){
       if("data" in error){
        const errMsg = (error.data as any).message;
        toast.error(errMsg);
        setMessage(errMsg);
       } else {
        toast.error("Failed to create order. Please contact support.");
        setMessage("Failed to create order. Please contact support.");
       }
    } 
  },[orderData, error, data._id, refetch, setOpen]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* Email Input */}
      <div>
        <LinkAuthenticationElement />
      </div>

      <div>
        <PaymentElement 
          options={{
            layout: "tabs"
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>

      {message && (
        <div className={`text-sm p-2 rounded ${
          message.includes("successful") 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}>
          {message}
        </div>
      )}
    </form>
  )
}

export default CheckoutForm

  