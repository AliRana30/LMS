"use client"
import React, { useEffect, useState } from 'react'
import SideBarProfile from './SideBarProfile';
import { useLogOutQuery } from '@/redux/features/api/apiSlice'; 
import { signOut } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"
import EnrolledCourses from './EnrolledCourses';
import { useTheme } from 'next-themes';

type Props = {
    user: any
}

const Profile: React.FC<Props> = ({user}) => {
    const [avatar, setAvatar] = useState(null);
    const [active, setActive] = useState(1);
    const [logout, setLogout] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    
    const { isSuccess, error } = useLogOutQuery(undefined, {
        skip: !logout
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isSuccess) {
            signOut({ redirect: false }).then(() => {
                toast.success("Logged out successfully!");
                router.push("/");
                router.refresh();
            });
        }
        
        if (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
            setLogout(false);
        }
    }, [isSuccess, error, router]);

    const logoutHandler = async() => {
        await signOut()
        setLogout(true);
        redirect("/")
    }

    if (!mounted) {
        return null;
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
            
            <div className="container mx-auto px-4 py-8 font-poppins">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl sm:text-3xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        My Profile
                    </h1>
                </div>

                <div className="flex flex-row gap-4 lg:gap-6">
                    <div className="w-auto lg:w-80 flex-shrink-0">
                        <SideBarProfile 
                            user={user} 
                            active={active} 
                            setActive={setActive} 
                            logoutHandler={logoutHandler}
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        {active === 1 && (
                            <ProfileInfo 
                                user={user} 
                                avatar={avatar}  
                            />
                        )}
                        {active === 2 && (
                            <ChangePassword/>
                        )}
                        {active === 3 && (
                            <EnrolledCourses  />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile