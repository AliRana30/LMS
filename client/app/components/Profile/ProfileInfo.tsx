import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/features/user/userApi'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineCamera } from 'react-icons/ai'
import { useTheme } from 'next-themes'

type Props = {
    avatar?: string | null
    user?: any
}

const ProfileInfo: React.FC<Props> = ({ avatar, user }) => {
    const [name, setName] = useState(user?.name || "");
    const [loadUser, setLoadUser] = useState(false);
    const { theme } = useTheme();
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [editProfile, { isSuccess: success, error: editError, isLoading: editLoading }] = useEditProfileMutation();
    const { } = useLoadUserQuery(undefined, { skip: !loadUser });

    const avatarUrl = avatar || user?.avatar?.url || user?.image || null;
    const isDark = theme === 'dark';

    const getInitials = (name: string) => {
        if (!name) return "U";
        const names = name.trim().split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // handle image
    const imageHandler = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            if (fileReader.readyState === 2) {
                updateAvatar(fileReader.result);
            }
        }
        fileReader.readAsDataURL(file);
    };

    // handle submit
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({ name: name });
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setLoadUser(true);
            toast.success("Avatar updated successfully")
        }
        if (error) {
            console.error('Avatar update error:', error);
            if ('data' in error) {
                console.error('Error data:', error.data);
            }
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (success) {
            setLoadUser(true);
            toast.success("User updated successfully")
        }
        if (editError) {
            console.error(editError);
        }
    }, [success, editError]);

    return (
        <div className={`rounded-xl shadow-2xl p-6 md:p-8 transition-colors duration-300 ${isDark
                ? 'bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-900/40 backdrop-blur-xl border border-cyan-500/20'
                : 'bg-white/80 backdrop-blur-xl border border-gray-200'
            }`}>

            <form onSubmit={handleSubmit}>
                {/* Avatar Upload Section */}
                <div className="mb-8">
                    <label className={`block text-sm font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Profile Picture
                    </label>
                    <div className="flex items-center gap-6">
                        {/* Avatar Display */}
                        <div className="relative group">
                            {avatarUrl ? (
                                <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ${isDark ? 'ring-blue-500/50' : 'ring-blue-500'
                                    }`}>
                                    <Image
                                        src={avatarUrl}
                                        alt="Profile Avatar"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center ring-4 ${isDark
                                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 ring-blue-500/50'
                                        : 'bg-gradient-to-br from-blue-400 to-cyan-400 ring-blue-500'
                                    }`}>
                                    <span className="text-white text-3xl md:text-4xl font-bold">
                                        {getInitials(user?.name || "User")}
                                    </span>
                                </div>
                            )}

                            {/* Camera Overlay */}
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <AiOutlineCamera className="text-white text-3xl" />
                            </label>
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={imageHandler}
                            />
                        </div>

                        {/* Upload Instructions */}
                        <div className="flex-1">
                            <label
                                htmlFor="avatar-upload"
                                className={`inline-block px-4 py-2 border-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${isDark
                                        ? 'border-gray-500 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                        : 'border-gray-300 text-gray-700  hover:shadow-lg '
                                    }`}
                            >
                                Change Picture
                            </label>
                            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                JPG, PNG or GIF. Max size 800KB
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Info Section */}
                {user && (
                    <div className="space-y-6">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user.email || ""}
                                disabled
                                className={`w-full px-4 py-3 border rounded-lg cursor-not-allowed ${isDark
                                        ? 'bg-gray-700/50 border-gray-600 text-gray-400'
                                        : 'bg-gray-100 border-gray-300 text-gray-500'
                                    }`}
                            />
                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                Email cannot be changed
                            </p>
                        </div>

                        <div className={`pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                            <button
                                type="submit"
                                disabled={editLoading}
                                className={`w-full md:w-auto px-8 py-3 border-2 font-semibold rounded-lg cursor-pointer transition-all duration-200 transform ${isDark
                                        ? 'border-gray-500 text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] disabled:border-gray-600 disabled:cursor-not-allowed disabled:hover:shadow-none'
                                        : 'border-gray-300 text-gray-700   disabled:border-gray-300 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:text-gray-400'
                                    }`}
                            >
                                {editLoading ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default ProfileInfo