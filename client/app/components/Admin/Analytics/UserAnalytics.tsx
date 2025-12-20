import { useGetUsersAnalyticsQuery } from '@/redux/features/analytics/analyticsApi'
import React, { FC } from 'react'
import { useTheme } from 'next-themes'
import { Users2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Loader from '../../Loader/Loader'

type Props = {
    isDashboard?: boolean
}

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
    const { theme } = useTheme()
    const { data, isLoading } = useGetUsersAnalyticsQuery({})

    const analyticsData: any = []

    data && data.users.last12Months.forEach((item: any) => {
        analyticsData.push({ name: item.month, count: item.count })
    })

    if (isLoading) {
        return <Loader />
    }

    return (
        <>
            {!isDashboard && (
                <div className={`w-full min-h-screen transition-all duration-300 font-poppins ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                            theme === 'dark'
                                ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                                : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                        }`}>
                            <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            Users Analytics
                                        </h2>
                                        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Last 12 months analytics data
                                        </p>
                                    </div>
                                    <Users2 className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                                </div>
                            </div>

                            <div className="p-6 lg:p-8">
                                <div className={`rounded-xl p-6 transition-all duration-300 border ${
                                    theme === 'dark'
                                        ? 'bg-slate-700/30 border-slate-600'
                                        : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <ResponsiveContainer width="100%" height={500}>
                                        <AreaChart
                                            width={500}
                                            height={400}
                                            data={analyticsData}
                                            margin={{
                                                top: 10,
                                                right: 30,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid 
                                                strokeDasharray="3 3" 
                                                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                                            />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                                            />
                                            <YAxis 
                                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    color: theme === 'dark' ? '#ffffff' : '#000000'
                                                }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="count" 
                                                stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
                                                fill={theme === 'dark' ? '#3b82f680' : '#2563eb80'}
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDashboard && (
                <div className={`rounded-xl p-6 transition-all duration-300 border ${
                    theme === 'dark'
                        ? 'bg-slate-700/30 border-slate-600'
                        : 'bg-slate-50 border-slate-200'
                }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                        Users Analytics
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={analyticsData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                            />
                            <XAxis 
                                dataKey="name" 
                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                            />
                            <YAxis 
                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    color: theme === 'dark' ? '#ffffff' : '#000000'
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="count" 
                                stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
                                fill={theme === 'dark' ? '#3b82f680' : '#2563eb80'}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </>
    )
}

export default UserAnalytics