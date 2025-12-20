"use client"
import React, { FC, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { styles } from '@/app/styles/style'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub, AiOutlineClose } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useRegisterMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes'

type Props = {
    setRoute: (route: string) => void
    setOpen: (open: boolean) => void
}

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email("Invalid email").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6, "Password must be at least 6 characters")
})

const Signup: FC<Props> = ({ setRoute, setOpen }) => {
    const { theme } = useTheme()
    const [show, setShow] = useState(false) 
    const [register, { isError, data, error, isSuccess, isLoading }] = useRegisterMutation();


    const formik = useFormik({
        initialValues : {
            name : '',
            email : '',
            password : ''
        },
        validationSchema: schema,
        onSubmit: async({name, email, password}) => {
            const userData = {
                name,
                email,
                password
            }
            await register(userData);
        }
    })

    //extract formik properties
    const { values, handleChange, handleSubmit, errors, touched } = formik;
    const { name, email, password } = values;


    useEffect(() => {
      if(isSuccess){
        const message = data?.message || "Registration successful!";
        toast.success(message);
        setRoute('verification');
      }
      if(isError && error){
        if ('data' in error) {
          const errMsg = (error.data as any)?.message || "Registration failed. Please try again.";
          toast.error(errMsg);
        } else if ('error' in error) {
          toast.error(error.error || "Registration failed. Please try again.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    }, [isSuccess, isError, data, error, setRoute])

    
  return (
    <div className={`w-full rounded-lg shadow-xl p-6 sm:p-8 relative font-poppins ${
            theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'
        }`}>
        <div className="flex justify-end mb-4">
            <AiOutlineClose
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
            />
        </div>
        <h1 className={`${styles.title}`}>Join Campus Core</h1>
        <form onSubmit={formik.handleSubmit}>
            {/* Name Input */}
            <div className="mb-4">
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    {...formik.getFieldProps('name')}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#37a39a] ${
                        theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your name"
                />
                {formik.touched.name && formik.errors.name && (
                    <span className="text-red-500 text-sm">{formik.errors.name}</span>
                )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps('email')}
                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#37a39a] ${
                        theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                    <span className="text-red-500 text-sm">{formik.errors.email}</span>
                )}
            </div>

            {/* Password Input */}
            <div className="mb-6">
                <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                    Password
                </label>
                <div className="relative">
                    <input
                        type={show ? "text" : "password"}
                        id="password"
                        {...formik.getFieldProps('password')}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#37a39a] ${
                            theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                    </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                    <span className="text-red-500 text-sm">{formik.errors.password}</span>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-[#37a39a] text-white py-2 rounded-lg font-semibold hover:bg-[#2d8b7f] transition-colors"
            >
                Sign Up
            </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <span className={`px-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Or continue with
            </span>
            <div className={`flex-1 h-px ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>

        {/* Social Login */}
        <div className="flex gap-4">
            <button
                onClick={() => signIn("google")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${
                    theme === 'dark'
                        ? 'border-gray-700 hover:bg-gray-800'
                        : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
                <FcGoogle size={24} />
            </button>
            <button
                onClick={() => signIn("github")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${
                    theme === 'dark'
                        ? 'border-gray-700 hover:bg-gray-800'
                        : 'border-gray-300 hover:bg-gray-50'
                }`}
            >
                <AiFillGithub size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
            </button>
        </div>

        {/* Sign In Link */}
        <p className={`text-center mt-6 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
            Already have an account?{' '}
            <span
                onClick={() => setRoute("login")}
                className="text-[#37a39a] cursor-pointer hover:underline"
            >
                Sign in
            </span>
        </p>
    </div>
  )
}

export default Signup