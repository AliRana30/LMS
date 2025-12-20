import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { HiMinus, HiPlus } from 'react-icons/hi'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { HelpCircle, Save } from 'lucide-react'
import Loader from '../../Loader/Loader'
import { useTheme } from 'next-themes'

type Props = {}

const EditFaq = (props: Props) => {
    const { theme } = useTheme()
    const [questions, setQuestions] = useState<any[]>([])
    const [activeQuestion, setActiveQuestion] = useState<string | null>(null)
    const { data, refetch } = useGetHeroDataQuery("FAQ", { refetchOnMountOrArgChange: true })
    const [editLayout, { isSuccess, isLoading, error }] = useEditLayoutMutation()
    

    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq)
        }
        if(isSuccess){
            refetch()
            toast.success("FAQ updated successfully")
        }
        if (error) {
            if ("data" in error) {
                const errData = error as any;
                toast.error(errData?.data?.message || "Failed to update FAQ section")
            }
        }
    }, [data, error, isSuccess, refetch])

    const toggleQuestion = (id: string) => {
        setActiveQuestion((prevQuestion) => (prevQuestion === id ? null : id))
    }

    const handleQuestionChange = (id: string, value: string) => {
        setQuestions(questions.map(q => 
            q._id === id ? { ...q, question: value } : q
        ))
    }

    const handleAnswerChange = (id: string, value: string) => {
        setQuestions(questions.map(q => 
            q._id === id ? { ...q, answer: value } : q
        ))
    }

    const newFaqHandler = () => {
        const newQuestion = {
            _id: `new_${Date.now()}`,
            question: "",
            answer: ""
        }
        setQuestions([...questions, newQuestion])
    }

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q._id !== id))
    }

    const areQuestionsChanged = (original: any[], updated: any[]) => {
        return JSON.stringify(original) !== JSON.stringify(updated)
    }

    const isQuestionEmpty = (questions: any[]) => {
        return questions.some((q) => q.question.trim() === "" || q.answer.trim() === "")
    }

    const handleEdit = async () => {
        if (isQuestionEmpty(questions)) {
            toast.error("Please fill all questions and answers")
            return
        }
        
        if (!areQuestionsChanged(data.layout.faq, questions)) {
            toast.error("No changes made")
            return
        }

        await editLayout({ type: "FAQ", faq: questions })
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
                                    Edit FAQ Section
                                </h2>
                                <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Manage frequently asked questions
                                </p>
                            </div>
                            <HelpCircle className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        <div className="space-y-6">
                            {questions.map((q: any, index: number) => (
                                <div
                                    key={q._id}
                                    className={`rounded-xl transition-all duration-300 border ${
                                        theme === 'dark'
                                            ? 'bg-slate-700/30 border-slate-600'
                                            : 'bg-slate-50 border-slate-200'
                                    }`}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <input
                                                className={`flex-1 border-none bg-transparent outline-none font-medium text-base ${
                                                    theme === 'dark' ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'
                                                }`}
                                                value={q.question}
                                                onChange={(e) =>
                                                    handleQuestionChange(q._id, e.target.value)
                                                }
                                                placeholder="Add your question..."
                                            />

                                            <button
                                                onClick={() => toggleQuestion(q._id)}
                                                className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                                                    theme === 'dark'
                                                        ? 'hover:bg-slate-600/50'
                                                        : 'hover:bg-slate-200'
                                                }`}
                                            >
                                                {activeQuestion === q._id ? (
                                                    <HiMinus className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} />
                                                ) : (
                                                    <HiPlus className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`} />
                                                )}
                                            </button>
                                        </div>

                                        {activeQuestion === q._id && (
                                            <div className="mt-4 space-y-3">
                                                <textarea
                                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 resize-none focus:outline-none focus:ring-2 ${
                                                        theme === 'dark'
                                                            ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-blue-500 focus:border-blue-500'
                                                    }`}
                                                    rows={4}
                                                    value={q.answer}
                                                    onChange={(e) =>
                                                        handleAnswerChange(q._id, e.target.value)
                                                    }
                                                    placeholder="Add your answer..."
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => deleteQuestion(q._id)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                                            theme === 'dark'
                                                                ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                                                                : 'bg-red-50 hover:bg-red-100 text-red-600'
                                                        }`}
                                                    >
                                                        <AiOutlineDelete className="text-lg cursor-pointer" />
                                                        <span className="text-sm font-medium">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Add New Question Button */}
                            <button
                                onClick={newFaqHandler}
                                className={`w-full py-4 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-2 ${
                                    theme === 'dark'
                                        ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/30 text-slate-400 hover:text-blue-400'
                                        : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-600'
                                }`}
                            >
                                <IoMdAddCircleOutline className="text-2xl" />
                                <span className="font-medium">Add New Question</span>
                            </button>
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleEdit}
                                disabled={!areQuestionsChanged(data?.layout?.faq || [], questions) || isQuestionEmpty(questions)}
                                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                                    areQuestionsChanged(data?.layout?.faq || [], questions) && !isQuestionEmpty(questions)
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

export default EditFaq