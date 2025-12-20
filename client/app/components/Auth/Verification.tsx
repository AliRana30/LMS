"use client"
import { styles } from '@/app/styles/style'
import { useActivationMutation } from '@/redux/features/auth/authApi'
import React , {FC, useEffect, useRef, useState} from 'react'
import toast from 'react-hot-toast'
import { VscWorkspaceTrusted } from 'react-icons/vsc'
import { AiOutlineClose } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { useTheme } from 'next-themes'

type Props = {
    setRoute : (route: string) => void
    setOpen: (open: boolean) => void
}

type VerifyNumber = {
    "0": string,
    "1": string,
    "2": string,
    "3": string,
}

const Verification: FC<Props> = ({ setRoute, setOpen }) => {
    const { theme } = useTheme()
    // FIX: Change from token to access_token
    const {access_token} = useSelector((state : any) => state.auth);
    const [activation , {isSuccess , error, isLoading}] = useActivationMutation();
    const [invalidError , setInvalidError] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const [verifyNumbers , setVerifyNumbers] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const verificationHandler = async () => {
    setInvalidError(false);
    
    const verificationNumber = Object.values(verifyNumbers).join('');
    
    // Validate OTP length
    if(verificationNumber.length !== 4){
        setInvalidError(true);
        toast.error("Please enter complete 4-digit code");
        return;
    }

    // Check if token exists
    if(!access_token) {
        toast.error("Activation token not found. Please register again.");
        setRoute("Sign-Up");
        return;
    }


    try {
        await activation({ 
            activation_token: access_token, 
            activation_code: verificationNumber 
        }).unwrap();
    } catch (err) {
        setInvalidError(true);
    }
  }

  const handleInputChange = (index : number , value : string) => {
    setInvalidError(false);
    const newVerifyNumber = {...verifyNumbers , [index] : value};
    setVerifyNumbers(newVerifyNumber);

    if(value  === "" && index > 0) {
        inputRefs[index - 1].current?.focus();
    }
    else if(value.length === 1 && index < 3) {
        inputRefs[index + 1].current?.focus();
    }
  }

  useEffect(()=>{
    if(isSuccess){
      toast.success("Account Activated Successfully")
      setRoute("Login")
    }
    if(error){
      if("data" in error){
        const errMsg = (error as any).data.message
        toast.error(errMsg)
        setInvalidError(true);
      } else if("error" in error){
        toast.error((error as any).error)
        setInvalidError(true);
      } else {
        toast.error("Activation Failed")
        setInvalidError(true);
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
     <h1 className={`${styles.title}`}>Verify Your Account</h1>
     <br />
     <div className="flex items-center justify-center mb-4 text-blue-600 text-4xl">
       <VscWorkspaceTrusted/>
     </div>
     <br />
     <div className='flex flex-row justify-center'>
      {Object.keys(verifyNumbers).map((key , index) => (
        <input 
            key={index}
            type="text"
            maxLength={1}
            ref={inputRefs[index]}
            value={verifyNumbers[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value.replace(/[^0-9]/g, ''))}
            className={`${styles.input} text-center mx-1 w-12 inline-block ${invalidError ? 'border-red-500' : ''}`}
            disabled={isLoading}
        />
      ))}
     </div>
     {invalidError && (
        <p className="text-red-500 text-sm text-center mt-2">Invalid verification code</p>
     )}
     <div>
      <button 
        className={`${styles.button} cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
        onClick={verificationHandler}
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify your OTP'}
      </button>
     </div>
     <br />
     <h5 className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
       Go Back to Login?{' '}
       <span className='text-[#37a39a] cursor-pointer hover:underline' onClick={()=>setRoute("Login")}>
         Login
       </span>
     </h5>
    </div>
  )
}

export default Verification