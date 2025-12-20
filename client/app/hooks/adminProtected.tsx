import React from 'react'
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

interface ProtectedProps {
    children: React.ReactNode;  
}  

const AdminProtected = ({ children }: ProtectedProps) => {
    const {user} = useSelector((state: any) => state.auth);

    const isAdmin = user && user.role === 'admin';
  return (
    <div>
        {
            isAdmin ?
        children
        : redirect('/')
        }
    </div>
  )
}

export default AdminProtected
