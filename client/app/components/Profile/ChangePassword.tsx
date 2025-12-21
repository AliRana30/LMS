"use client";
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();
    const { user } = useSelector((state: any) => state.auth);
    
    // Check if user is a social auth user (no password set)
    const isSocialAuthUser = !user?.password;

    const passwordChangeHandler = async (e: any) => {
        e.preventDefault();
        
        // For social auth users, oldPassword can be empty or any value
        if(!newPassword || !confirmPassword) {
            toast.error("Please fill all the required fields");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        
        // For social auth users, send a dummy old password or the same as new
        const passwordData = isSocialAuthUser 
            ? { oldPassword: "socialauth", newPassword } 
            : { oldPassword, newPassword };
            
        await updatePassword(passwordData);
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(isSocialAuthUser ? "Password set successfully" : "Password updated successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        if (error) {
            if ('data' in error) {
                const errMsg = (error as any).data?.message || "Password update failed";
                toast.error(errMsg);
            }
        }
    }, [isSuccess, error, isSocialAuthUser]);

  return (
    <div className=''>
        <h2 className="text-2xl font-semibold mb-4">
            {isSocialAuthUser ? "Set Password" : "Change Password"}
        </h2>
        {isSocialAuthUser && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You signed in with a social account. Set a password to enable email/password login.
            </p>
        )}
        <form className="space-y-4" onSubmit={passwordChangeHandler}>
            {!isSocialAuthUser && (
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Enter your old password"
                    />
                </div>
            )}
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"  
                    placeholder="Enter your new password"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Confirm your new password"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                {isSocialAuthUser ? "Set Password" : "Update Password"}
            </button>
        </form>
    </div>
  )
}

export default ChangePassword

