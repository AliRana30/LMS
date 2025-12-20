"use client";
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const passwordChangeHandler = async (e: any) => {
        e.preventDefault();
        if(!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill all the fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }
        else{
            await updatePassword({ oldPassword, newPassword });
        }
    }

    useEffect(()    => {
        if (isSuccess) {
            toast.success("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        if (error) {
            toast.error("Password update failed");
            if ('data' in error) {
                const errMsg = (error as any).data?.message || "Password update failed";
                toast.error(errMsg);
            }
        }
    }, [isSuccess, error]);

  return (
    <div className=''>
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
        <form className="space-y-4" onSubmit={passwordChangeHandler}>
            <div>
                <label className="block text-gray-700 mb-2">Old Password</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your old password"

                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"  

                    placeholder="Enter your new password"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm your new password"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Update Password</button>
        </form>
    </div>
  )
}

export default ChangePassword

