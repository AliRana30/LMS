import React from 'react'
import { useTheme } from 'next-themes'
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Label, LabelList } from 'recharts'
import Loader from '../../Loader/Loader'
import { useGetCoursesAnalyticsQuery } from '@/redux/features/analytics/analyticsApi'

type Props = {}

const CourseAnalytics = (props: Props) => {
  const { theme } = useTheme()
  const { data, isLoading, isError } = useGetCoursesAnalyticsQuery({})

  const analyticsData: any = []

  data && data.courses.last12Months.forEach((item: any) => {
    analyticsData.push({ name: item.month, uv: item.count })
  })

  const minValue = 0

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={`w-full min-h-screen transition-all duration-300 font-poppins ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
            : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
          }`}>
          <div className={`px-4 sm:px-6 py-4 sm:py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Courses Analytics
                </h2>
                <p className={`mt-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Last 12 months analytics data
                </p>
              </div>
              <BarChart3 className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            <div className={`rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-300 border overflow-x-auto ${theme === 'dark'
                ? 'bg-slate-700/30 border-slate-600'
                : 'bg-slate-50 border-slate-200'
              }`}>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }} className="sm:h-[350px] md:h-[400px] lg:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData} margin={{ top: 20, right: 10, left: -20, bottom: 60 }}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  >
                    <Label offset={0} position="insideBottom" />
                  </XAxis>
                  <YAxis domain={[minValue, 'auto']} />
                  <Bar dataKey="uv" fill={theme === 'dark' ? '#3b82f6' : '#2563eb'}>
                    <LabelList dataKey="uv" position="top" />
                  </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseAnalytics