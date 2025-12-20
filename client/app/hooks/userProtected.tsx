import React from 'react'
import userAuth from './userAuth';
import { redirect } from 'next/navigation';

interface ProtectedProps {
    children: React.ReactNode;  
}  

const Protected = ({ children }: ProtectedProps) => {
    const {isAuthenticated} = userAuth()
  return (
    <div>
        {
            isAuthenticated ?
        children
        : redirect('/')
        }
    </div>
  )
}

export default Protected
