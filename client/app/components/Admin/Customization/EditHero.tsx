"use client"
import { styles } from '@/app/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineCamera } from 'react-icons/ai';
import { Save, ImageIcon } from 'lucide-react';
import Loader from '../../Loader/Loader';
import { useTheme } from 'next-themes';

type Props = {}

const EditHero = (props: Props) => {
    const { theme } = useTheme()
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [image, setImage] = useState<string>("");
    const { data, refetch } = useGetHeroDataQuery("Banner", { refetchOnMountOrArgChange: true });
    const [editLayout, { isSuccess, isLoading, error }] = useEditLayoutMutation()

    const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = (e: any) => {
                if (reader.readyState === 2) {
                    setImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        if (data) {
            setTitle(data?.layout?.banner.title);
            setSubTitle(data?.layout?.banner.subTitle);
            setImage(data?.layout?.banner.image?.url);
        }
        if (isSuccess) {
            refetch()
            toast.success("Hero section updated successfully!")
        }
        if (error) {
            if ("data" in error) {
                const errData = error as any;
                toast.error(errData?.data?.message || "Failed to update hero section")
            }
        }
    }, [data, isSuccess, error])

    const handleEdit = async () => {
        if (!title.trim() || !subTitle.trim()) {
            toast.error("Please fill in all fields");
            return;
        }
        await editLayout({
            type: "Banner",
            image,
            title,
            subTitle,
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className={`w-full transition-all duration-300 font-poppins ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Card Container */}
                <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                    theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                        : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                }`}>
                    {/* Header */}
                    <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    Edit Hero Section
                                </h2>
                                <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Customize your landing page 
                                </p>
                            </div>
                            <ImageIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Left Column - Image */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative w-full max-w-md">
                                    {/* Image Container */}
                                    <div className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                        theme === 'dark'
                                            ? 'border-slate-600 bg-slate-700/30'
                                            : 'border-slate-300 bg-slate-100'
                                    }`}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Hero Banner"
                                                className="w-full h-[100%] object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className={`w-16 h-16 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Camera Button */}
                                    <div className="absolute -bottom-4 -right-4">
                                        <input
                                            type="file"
                                            id="banner"
                                            accept="image/*"
                                            onChange={handleUpdate}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="banner"
                                            className={`flex items-center justify-center w-14 h-14 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 ${
                                                theme === 'dark'
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                        >
                                            <AiOutlineCamera className="text-white text-2xl" />
                                        </label>
                                    </div>
                                </div>

                                <p className={`mt-6 text-sm text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Click the camera icon to upload a new image
                                </p>
                            </div>

                            {/* Right Column - Form */}
                            <div className="flex flex-col space-y-6">
                                {/* Title Input */}
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Hero Title
                                    </label>
                                    <textarea
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        rows={4}
                                        placeholder="Enter your hero title..."
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 resize-none focus:outline-none focus:ring-2 ${
                                            theme === 'dark'
                                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {title.length} characters
                                    </p>
                                </div>

                                {/* Subtitle Input */}
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Hero Subtitle
                                    </label>
                                    <textarea
                                        value={subTitle}
                                        onChange={(e) => setSubTitle(e.target.value)}
                                        rows={4}
                                        placeholder="Enter your hero subtitle..."
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 resize-none focus:outline-none focus:ring-2 ${
                                            theme === 'dark'
                                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                    <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {subTitle.length} characters
                                    </p>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleEdit}
                                    disabled={isLoading}
                                    className={`cursor-pointer text-white  w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-[#37a39a] hover:bg-[#2d8b7f]
                                    }`}
                                >
                                    <Save className="w-5 h-5" />
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className={`mt-8 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                    theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700/50'
                        : 'bg-white/70 border-slate-200/50'
                }`}>
                </div>
            </div>
        </div>
    )
}

export default EditHero