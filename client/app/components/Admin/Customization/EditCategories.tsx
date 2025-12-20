import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { FolderOpen, Save } from 'lucide-react'
import Loader from '../../Loader/Loader'
import { useTheme } from 'next-themes'

type Props = {}

const EditCategories = (props: Props) => {
    const { theme } = useTheme()
    const [categories, setCategories] = useState<any[]>([])
    const { data, refetch } = useGetHeroDataQuery("Categories", { refetchOnMountOrArgChange: true })
    const [editLayout, { isSuccess, isLoading, error }] = useEditLayoutMutation()

    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories)
        }
        if (isSuccess) {
            refetch()
            toast.success("Categories updated successfully")
        }
        if (error) {
            if ("data" in error) {
                const errData = error as any;
                toast.error(errData?.data?.message || "Failed to update categories")
            }
        }
    }, [data, isSuccess, error, refetch])

    const handleCategoryChange = (id: string, value: string) => {
        setCategories(categories.map(cat => 
            cat._id === id ? { ...cat, title: value } : cat
        ))
    }

    const handleAddCategory = () => {
        const newCategory = {
            _id: `new_${Date.now()}`,
            title: ""
        }
        setCategories([...categories, newCategory])
    }

    const handleDeleteCategory = (id: string) => {
        setCategories(categories.filter(cat => cat._id !== id))
    }

    const areCategoriesChanged = (original: any[], updated: any[]) => {
        return JSON.stringify(original) !== JSON.stringify(updated)
    }

    const isCategoryEmpty = (categories: any[]) => {
        return categories.some((cat) => cat.title.trim() === "")
    }

    const handleEdit = async () => {
        if (isCategoryEmpty(categories)) {
            toast.error("Please fill all category titles")
            return
        }
        
        if (!areCategoriesChanged(data.layout.categories, categories)) {
            toast.error("No changes made")
            return
        }

        await editLayout({ type: "Categories", categories })
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
                                    Edit Categories
                                </h2>
                                <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Manage course categories
                                </p>
                            </div>
                            <FolderOpen className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((category: any, index: number) => (
                                <div
                                    key={category._id}
                                    className={`rounded-xl transition-all duration-300 border p-4 ${
                                        theme === 'dark'
                                            ? 'bg-slate-700/30 border-slate-600'
                                            : 'bg-slate-50 border-slate-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={category.title}
                                            onChange={(e) => handleCategoryChange(category._id, e.target.value)}
                                            placeholder="Enter category title..."
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
                                                theme === 'dark'
                                                    ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        />
                                        <button
                                            onClick={() => handleDeleteCategory(category._id)}
                                            className={`p-3 rounded-lg transition-all duration-200 ${
                                                theme === 'dark'
                                                    ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                                                    : 'bg-red-50 hover:bg-red-100 text-red-600'
                                            }`}
                                        >
                                            <AiOutlineDelete className="text-xl" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add New Category Button */}
                        <button
                            onClick={handleAddCategory}
                            className={`w-full mt-6 py-4 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-2 ${
                                theme === 'dark'
                                    ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/30 text-slate-400 hover:text-blue-400'
                                    : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-600'
                            }`}
                        >
                            <IoMdAddCircleOutline className="text-2xl" />
                            <span className="font-medium">Add New Category</span>
                        </button>

                        {/* Save Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleEdit}
                                disabled={!areCategoriesChanged(data?.layout?.categories || [], categories) || isCategoryEmpty(categories)}
                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                    areCategoriesChanged(data?.layout?.categories || [], categories) && !isCategoryEmpty(categories)
                                        ? 'bg-[#37a39a] hover:bg-[#2d8b7f] text-white cursor-pointer'
                                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                            >
                                <Save className="w-5 h-5" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCategories