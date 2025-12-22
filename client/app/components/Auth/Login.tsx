"use client"
import { styles } from '@/app/styles/style'
import { useFormik } from 'formik'
import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub, AiOutlineClose } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useLoginMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes'

type Props = {
  route: string
  setRoute: (route: string) => void
  setOpen: (open: boolean) => void
}

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6, "Password must be at least 6 characters")
})


const Login: FC<Props> = ({ setRoute, setOpen, route }) => {
    const { theme } = useTheme()
  const [set, setShow] = useState(false)
  const [login, { isSuccess, error, data, isLoading }] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    }
  })

  // getting values from formik
  const { values, handleChange, handleSubmit, errors, touched } = formik;
  const { email, password } = values;

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRoute('signup');
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Login Successful");
    }
    if (error) {
       if ('data' in error) {
          const errMsg = (error.data as any)?.message || "Login failed";
          toast.error(errMsg);
        } else if ('error' in error) {
          toast.error(error.error || "Login failed");
        } else {
          toast.error("Login failed");
        }
    }
  }, [isSuccess, error])
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
      <h1 className={`${styles.title}`}>Login with Campus Core</h1>
      <form onSubmit={formik.handleSubmit}>
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
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
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
              type={set ? "text" : "password"}
              id="password"
              {...formik.getFieldProps('password')}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#37a39a] ${
                theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
              } ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShow(!set)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {set ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-500 text-sm">{formik.errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#37a39a] text-white py-2 rounded-lg font-semibold hover:bg-[#2d8b7f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing In...</span>
            </>
          ) : (
            'Sign In'
          )}
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

      {/* Sign Up Link */}
      <p className={`text-center mt-6 text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Don't have an account?{' '}
        <span
          onClick={() => setRoute("signup")}
          className="text-[#37a39a] cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  )
}

export default Login