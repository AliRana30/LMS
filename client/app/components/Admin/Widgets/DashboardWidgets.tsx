import React, { FC, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { PiUsersFour } from 'react-icons/pi'
import UserAnalytics from '../Analytics/UserAnalytics'
import { Box, CircularProgress, Typography } from '@mui/material'
import { BsBorderLeft } from 'react-icons/bs'
import OrderAnalytics from '../Analytics/OrderAnalytics'
import AllInvoices from '../Order/AllInvoices'
import { useGetAllOrdersQuery } from '@/redux/features/orders/orderApi'
import { useGetAllUsersQuery } from '@/redux/features/user/userApi'

type Props = {
    open?: boolean
    value?: number
}

const CircularProgressWithLabel: FC<Props> = ({ open, value = 0 }) => {
    const { theme } = useTheme()
    
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={45}
                thickness={4}
                style={{ 
                    zIndex: open ? -1 : 1,
                    color: theme === 'dark' ? '#3b82f6' : '#2563eb'
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    style={{
                        color: theme === 'dark' ? '#94a3b8' : '#64748b',
                        fontSize: '12px',
                        fontWeight: 600
                    }}
                >
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    )
}

const DashboardWidgets: FC<Props> = ({ open }) => {
    const { theme } = useTheme()
    
    const { data: ordersData } = useGetAllOrdersQuery({}, { refetchOnMountOrArgChange: true })
    const { data: usersData } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true })

    // Calculate statistics
    const stats = useMemo(() => {
        const totalOrders = ordersData?.orders?.length || 0
        const totalUsers = usersData?.users?.length || 0
        
        // Calculate new users from last month
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        
        const newUsers = usersData?.users?.filter((user: any) => 
            new Date(user.createdAt) >= oneMonthAgo
        ).length || 0

        // Calculate sales from last month
        const newSales = ordersData?.orders?.filter((order: any) => 
            new Date(order.createdAt) >= oneMonthAgo
        ).length || 0

        // Calculate percentage growth
        const usersGrowth = totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0
        const salesGrowth = totalOrders > 0 ? Math.round((newSales / totalOrders) * 100) : 0

        return {
            totalOrders,
            totalUsers,
            newUsers,
            newSales,
            usersGrowth,
            salesGrowth
        }
    }, [ordersData, usersData])

    return (
        <div className={`w-full transition-all duration-300 font-poppins ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                    <div className="lg:col-span-8">
                        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                            theme === 'dark'
                                ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                                : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                        }`}>
                            <div className={`px-6 py-5 border-b ${
                                theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
                            }`}>
                                <h3 className={`text-lg font-semibold ${
                                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                                }`}>
                                    Users Analytics
                                </h3>
                            </div>
                            <div className="p-6">
                                <UserAnalytics isDashboard={true} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        {/* Sales Widget */}
                        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                            theme === 'dark'
                                ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                                : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                        }`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className={`p-3 rounded-lg inline-flex mb-4 ${
                                            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'
                                        }`}>
                                            <BsBorderLeft className={`text-3xl ${
                                                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                            }`} />
                                        </div>
                                        <h5 className={`text-2xl font-bold mb-2 ${
                                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                            {stats.totalOrders}
                                        </h5>
                                        <p className={`text-sm font-medium ${
                                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                        }`}>
                                            Total Sales
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <CircularProgressWithLabel value={stats.salesGrowth} open={open} />
                                        <span className={`text-sm font-semibold mt-2 ${
                                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                        }`}>
                                            +{stats.salesGrowth}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* New Users Widget */}
                        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                            theme === 'dark'
                                ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                                : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                        }`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className={`p-3 rounded-lg inline-flex mb-4 ${
                                            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-50'
                                        }`}>
                                            <PiUsersFour className={`text-3xl ${
                                                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                            }`} />
                                        </div>
                                        <h5 className={`text-2xl font-bold mb-2 ${
                                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                            {stats.newUsers}
                                        </h5>
                                        <p className={`text-sm font-medium ${
                                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                        }`}>
                                            New Users
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <CircularProgressWithLabel value={stats.usersGrowth} open={open} />
                                        <span className={`text-sm font-semibold mt-2 ${
                                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                        }`}>
                                            +{stats.usersGrowth}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Analytics Section */}
                <div className="mb-6">
                    <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                        theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                            : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                    }`}>
                        <div className={`px-6 py-5 border-b ${
                            theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
                        }`}>
                            <h3 className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                                Orders Analytics
                            </h3>
                        </div>
                        <div className="p-6">
                            <OrderAnalytics isDashboard={true} />
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div>
                    <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                        theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                            : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                    }`}>
                        <div className={`px-6 py-5 border-b ${
                            theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
                        }`}>
                            <h3 className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                                Recent Transactions
                            </h3>
                        </div>
                        <AllInvoices isDashboard={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardWidgets