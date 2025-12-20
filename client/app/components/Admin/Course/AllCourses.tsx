import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit2, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'timeago.js';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {}

const AllCourses = (props: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState("");
  const [deleteCourse, { isLoading: isDeleting, isSuccess: deleteSuccess, error: deleteError }] = useDeleteCourseMutation();
  const { data, error, isLoading, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

  const handleDeleteClick = (id: string) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCourse(courseToDelete).unwrap();
      setDeleteDialogOpen(false);
      setCourseToDelete("");
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const handleEditCourse = (id: string) => {
    router.push(`/admin/edit-course/${id}`);
  };

  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      flex: 0.3,
      minWidth: 100,
      hide: true
    },
    { 
      field: "title", 
      headerName: "Course Title", 
      flex: 1,
      minWidth: 200
    },
    { 
      field: "ratings", 
      headerName: "Ratings", 
      flex: 0.3,
      minWidth: 100
    },
    { 
      field: "purchases", 
      headerName: "Purchased", 
      flex: 0.3,
      minWidth: 100
    },
    { 
      field: "created_at", 
      headerName: "Created At", 
      flex: 0.4,
      minWidth: 150
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params: any) => (
        <Button onClick={() => handleEditCourse(params.row.id)}>
          <Edit2 size={20} className={theme === "dark" ? "text-white" : "text-black"} />
        </Button>
      )
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params: any) => (
        <Button onClick={() => handleDeleteClick(params.row.id)}>
          <AiOutlineDelete size={20} className={theme === "dark" ? "text-white" : "text-black"} />
        </Button>
      )
    }
  ];

  const rows = useMemo(() => {
    if (!data?.courses) return [];

    return data.courses.map((course: any) => ({
      id: course._id,
      title: course.name,
      ratings: course.ratings,
      purchases: course.purchased,
      created_at: format(course.createdAt)
    }));
  }, [data]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Course deleted successfully");
      refetch();
    }
    if (deleteError) {
      if ('data' in deleteError) {
        toast.error((deleteError as any).data.message);
      } else {
        toast.error("Failed to delete course");
      }
    }
  }, [deleteSuccess, deleteError, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`w-full min-h-screen transition-all duration-300 font-poppins ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 border overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700/50 shadow-slate-900/50'
            : 'bg-white/70 border-slate-200/50 shadow-slate-200/50'
        }`}>
          <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  All Courses
                </h2>
                <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage all your courses
                </p>
              </div>
              <BookOpen className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <Box
              className="w-full"
              sx={{
                height: { xs: '500px', sm: '600px', md: '650px' },
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
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: theme === "dark" ? "#fff !important" : "#000 !important",
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
                checkboxSelection
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                loading={isDeleting}
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            minWidth: { xs: '90%', sm: '400px' },
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: theme === "dark" ? "#fff" : "#000", fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <p className="text-base" style={{ color: theme === "dark" ? "#cbd5e1" : "#475569" }}>
            Are you sure you want to delete this course? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: theme === "dark" ? "#94a3b8" : "#64748b",
              '&:hover': {
                backgroundColor: theme === "dark" ? "#334155" : "#f1f5f9"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={isDeleting}
            sx={{
              backgroundColor: "#dc2626",
              color: "#fff",
              '&:hover': {
                backgroundColor: "#b91c1c",
              },
              '&:disabled': {
                backgroundColor: "#9ca3af",
                color: "#fff",
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllCourses;