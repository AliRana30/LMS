import React, { FC } from 'react'
import { useTheme } from 'next-themes'
import { ListOrdered } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from 'recharts'
import { useGetOrdersAnalyticsQuery } from '@/redux/features/analytics/analyticsApi'
import Loader from '../../Loader/Loader'

type Props = {
    isDashboard?: boolean
}

const OrderAnalytics : FC<Props> = ({isDashboard}) => {
  const { theme } = useTheme()
  const { data, isLoading, isError } = useGetOrdersAnalyticsQuery({})

  const analyticsData: any = []

  data && data.orders.last12Months.forEach((item: any) => {
    analyticsData.push({ name: item.month, count: item.count })
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={`w-full min-h-screen transition-all duration-300 font-poppins ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
            : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
        }`}>
          <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Orders Analytics
                </h2>
                <p className={`mt-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Last 12 months analytics data
                </p>
              </div>
              <ListOrdered className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className={`rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 border overflow-x-auto ${
              theme === 'dark'
                ? 'bg-slate-700/30 border-slate-600'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }} className="sm:h-[350px] md:h-[400px] lg:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -20,
                      bottom: 5,
                    }}
                  >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                  <Legend 
                    wrapperStyle={{
                      color: theme === 'dark' ? '#94a3b8' : '#64748b'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'}
                    strokeWidth={2}
                    dot={{ fill: theme === 'dark' ? '#3b82f6' : '#2563eb', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default OrderAnalytics