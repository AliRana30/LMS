import React, { FC, useEffect, useMemo, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useTheme } from 'next-themes'
import { useGetAllOrdersQuery } from '@/redux/features/orders/orderApi'
import { useGetAllUsersQuery } from '@/redux/features/user/userApi'
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import { format } from 'timeago.js'
import { Receipt, TrendingUp } from 'lucide-react'
import { AiOutlineMail } from 'react-icons/ai'

type Props = {
    isDashboard?: boolean
}

const AllInvoices: FC<Props> = ({ isDashboard }) => {
    const { theme } = useTheme()
    const { data, isLoading } = useGetAllOrdersQuery({}, { refetchOnMountOrArgChange: true })
    const { data: usersData } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true })
    const { data: coursesData } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true })

    const columns = [
        { 
            field: "id", 
            headerName: "ID", 
            flex: 0.3,
            minWidth: 80
        },
        { 
            field: "userName", 
            headerName: "User Name", 
            flex: 0.6,
            minWidth: 150
        },
        { 
            field: "userEmail", 
            headerName: "Email", 
            flex: 0.8,
            minWidth: 200
        },
        { 
            field: "courseTitle", 
            headerName: "Course Title", 
            flex: 1,
            minWidth: 200
        },
        { 
            field: "price", 
            headerName: "Price", 
            flex: 0.4,
            minWidth: 100
        },
        { 
            field: "created_at", 
            headerName: "Created At", 
            flex: 0.5,
            minWidth: 150
        },
        ...(isDashboard ? [] : [{
            field: "email",
            headerName: "Email",
            flex: 0.2,
            minWidth: 80,
            renderCell: (params: any) => (
                <a 
                    href={`mailto:${params.row.userEmail}`} 
                    className="flex items-center justify-center h-full"
                >
                    <AiOutlineMail size={20} className={theme === "dark" ? "text-white" : "text-black"} />
                </a>
            )
        }])
    ];

    const rows = useMemo(() => {
        if (!data?.orders || !usersData?.users || !coursesData?.courses) return [];

        return data.orders.map((order: any) => {
            const user = usersData.users.find((user: any) => user._id === order.userId);
            const course = coursesData.courses.find((course: any) => course._id === order.courseId);
            
            return {
                id: order._id,
                userName: user?.name || 'Unknown User',
                userEmail: user?.email || 'Unknown Email',
                courseTitle: course?.name || 'Unknown Course',
                price: course?.price ? `$${course.price}` : '$0',
                created_at: format(order.createdAt),
            };
        });
    }, [data, usersData, coursesData]);

    return (
        <div className={`w-full ${isDashboard ? '' : 'min-h-screen'} transition-all duration-300 font-poppins ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className={`${isDashboard ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8'}`}>
                <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
                    theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
                        : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
                }`}>
                    {!isDashboard && (
                        <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        All Invoices
                                    </h2>
                                    <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                        View and manage all transaction invoices
                                    </p>
                                </div>
                                <Receipt className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                        </div>
                    )}

                    <div className={`${isDashboard ? 'p-4' : 'p-4 sm:p-6 lg:p-8'}`}>
                        <Box
                            className="w-full"
                            sx={{
                                height: isDashboard ? '400px' : { xs: '500px', sm: '600px', md: '650px' },
                                width: '100%',
                                "& .MuiDataGrid-root": {
                                    border: theme === "dark" ? "1px solid #475569" : "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    outline: "none",
                                },
                                "& .MuiDataGrid-columnSeparator": {
                                    color: theme === "dark" ? "#475569" : "#e2e8f0",
                                },
                                "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                                    color: theme === "dark" ? "#fff" : "#000",
                                },
                                "& .MuiDataGrid-sortIcon": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-menuIconButton": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-filterIcon": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-row": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                    backgroundColor: "transparent !important",
                                    "&:hover": {
                                        backgroundColor: theme === "dark" ? "#334155 !important" : "#f1f5f9 !important",
                                    },
                                },
                                "& .MuiDataGrid-row.Mui-selected": {
                                    backgroundColor: theme === "dark" ? "#475569 !important" : "#e2e8f0 !important",
                                    "&:hover": {
                                        backgroundColor: theme === "dark" ? "#64748b !important" : "#cbd5e1 !important",
                                    },
                                },
                                "& .MuiTablePagination-root": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: theme === "dark" ? "1px solid #475569" : "1px solid #e2e8f0",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' },
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: theme === "dark" ? "#1e293b" : "#f8fafc",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                    borderBottom: theme === "dark" ? "1px solid #475569" : "1px solid #e2e8f0",
                                    borderRadius: "12px 12px 0 0",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    backgroundColor: theme === "dark" ? "#1e293b" : "#f8fafc",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                    "&:focus": {
                                        outline: "none",
                                    },
                                    "&:focus-within": {
                                        outline: "none",
                                    },
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                    fontWeight: "600",
                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    backgroundColor: theme === "dark" ? "#1e293b" : "#f8fafc",
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                    borderTop: theme === "dark" ? "1px solid #475569" : "1px solid #e2e8f0",
                                    borderRadius: "0 0 12px 12px",
                                },
                                "& .MuiCheckbox-root": {
                                    color: theme === "dark" ? "#3b82f6 !important" : "#2563eb !important",
                                },
                                "& .MuiDataGrid-toolbarContainer": {
                                    padding: "12px 16px",
                                    gap: "8px",
                                    "& .MuiButton-text": {
                                        color: theme === "dark" ? "#fff !important" : "#000 !important",
                                        fontSize: "0.875rem",
                                        padding: "6px 12px",
                                    }
                                },
                                "& .MuiTablePagination-selectLabel": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-displayedRows": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-select": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-selectIcon": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiTablePagination-actions": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                                "& .MuiIconButton-root": {
                                    color: theme === "dark" ? "#fff !important" : "#000 !important",
                                },
                            }}
                        >
                            <DataGrid
                                checkboxSelection={!isDashboard}
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: isDashboard ? 5 : 10 },
                                    },
                                }}
                                pageSizeOptions={isDashboard ? [5] : [5, 10, 25]}
                                loading={isLoading}
                                disableRowSelectionOnClick
                                slots={!isDashboard ? { toolbar: GridToolbar } : undefined}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                        quickFilterProps: { debounceMs: 500 },
                                    }
                                }}
                            />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllInvoices