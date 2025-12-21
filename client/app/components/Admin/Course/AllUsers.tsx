import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit2, Users, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { format } from 'timeago.js';
import { AiOutlineDelete, AiOutlineMail } from 'react-icons/ai';
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from '@/redux/features/user/userApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

type Props = {
  isTeam?: boolean;
}

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userToDelete, setUserToDelete] = useState("");
  const [role, setRole] = useState("user");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("user");
  const {user} = useSelector((state: any) => state.auth);

  const [updateUserRole, { isSuccess: updateSuccess, error: updateError, isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError, isLoading: isDeleting }] = useDeleteUserMutation();
  const { data, isLoading, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userToDelete).unwrap();
      setDeleteDialogOpen(false);
      setUserToDelete("");
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleEditRole = (id: string, currentRole: string) => {
    setUserId(id);
    setRole(currentRole);
    setEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    try {
      await updateUserRole({ id: userId, role }).unwrap();
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast.error("Please enter an email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      // Check if user exists
      const existingUser = data?.users?.find((user: any) => user.email === newMemberEmail);
      
      if (!existingUser) {
        toast.error("User with this email does not exist");
        return;
      }

      // Update user role to add them as member
      await updateUserRole({ id: existingUser._id, role: newMemberRole }).unwrap();
      setAddMemberDialogOpen(false);
      setNewMemberEmail("");
      setNewMemberRole("user");
      toast.success("Member added successfully");
    } catch (err) {
      console.error('Failed to add member:', err);
      toast.error("Failed to add member");
    }
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
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 150
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.8,
      minWidth: 200
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.3,
      minWidth: 100
    },
    {
      field: "courses",
      headerName: "Purchased Courses",
      flex: 0.3,
      minWidth: 120
    },
    {
      field: "joined_at",
      headerName: "Joined At",
      flex: 0.4,
      minWidth: 150
    },
    {
      field: "edit",
      headerName: "Edit Role",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params: any) => (
        <Button onClick={() => handleEditRole(params.row.id, params.row.role)} disabled={isUpdating || (user && user._id === params.row.id)}>
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
    },
    {
      field: "send_email",
      headerName: "Send Email",
      flex: 0.2,
      minWidth: 80,
      renderCell: (params: any) => (
        <a href={`mailto:${params.row.email}`} className="flex items-center justify-center h-full">
          <AiOutlineMail size={20} className={theme === "dark" ? "text-white" : "text-black"} />
        </a>
      )
    }
  ];

  const rows = useMemo(() => {
    if (!data?.users) return [];

    const filteredUsers = isTeam
      ? data.users.filter((user: any) => user.role === "admin")
      : data.users.filter((user: any) => user.role === "admin" || user.role === "user");

    return filteredUsers.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      courses: user.courses?.length || 0,
      joined_at: format(user.createdAt),
    }));
  }, [data, isTeam]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("User role updated successfully");
      refetch();
    }
    if (updateError && "data" in updateError) {
      toast.error((updateError as any).data.message || "Failed to update user role");
    }
    if (deleteSuccess) {
      toast.success("User deleted successfully");
      refetch();
    }
    if (deleteError && "data" in deleteError) {
      toast.error((deleteError as any).data.message || "Failed to delete user");
    }
  }, [updateSuccess, updateError, deleteSuccess, deleteError, refetch]);

  return (
    <div className={`w-full transition-all duration-300 font-poppins`}>
      <div className="w-full">
        <div className={`rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-500 border overflow-hidden relative ${
          theme === 'dark'
            ? 'bg-slate-800/90 border-slate-700/50'
            : 'bg-white border-slate-200/50'
        }`}>
          <div className={`px-6 py-5 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {isTeam ? 'Team Members' : 'All Users'}
                </h2>
                <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Manage your {isTeam ? 'team members' : 'users'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setAddMemberDialogOpen(true)}
                  sx={{
                    backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
                    color: "#fff",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    '&:hover': {
                      backgroundColor: theme === "dark" ? "#2563eb" : "#1d4ed8",
                    }
                  }}
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Add New Member</span>
                  <span className="sm:hidden">Add</span>
                </Button>
                <Users className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            <Box
              className="w-full"
              sx={{
                height: { xs: '400px', sm: '500px', md: '600px', lg: '650px' },
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
                loading={isLoading}
                disableRowSelectionOnClick
              />
            </Box>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Dialog
        open={addMemberDialogOpen}
        onClose={() => !isUpdating && setAddMemberDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            minWidth: { xs: '90%', sm: '450px' },
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: theme === "dark" ? "#fff" : "#000", fontWeight: 600 }}>
          Add New Member
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '20px !important' }}>
          <TextField
            autoFocus
            fullWidth
            label="Email Address"
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter user email"
            sx={{
              mb: 3,
              '& .MuiInputLabel-root': {
                color: theme === "dark" ? "#94a3b8" : "#64748b",
                '&.Mui-focused': {
                  color: theme === "dark" ? "#3b82f6" : "#2563eb",
                }
              },
              '& .MuiOutlinedInput-root': {
                color: theme === "dark" ? "#fff" : "#000",
                '& fieldset': {
                  borderColor: theme === "dark" ? "#475569" : "#cbd5e1",
                },
                '&:hover fieldset': {
                  borderColor: theme === "dark" ? "#64748b" : "#94a3b8",
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme === "dark" ? "#3b82f6" : "#2563eb",
                }
              }
            }}
          />
          <FormControl fullWidth>
            <InputLabel
              id="member-role-label"
              sx={{ 
                color: theme === "dark" ? "#94a3b8" : "#64748b",
                '&.Mui-focused': {
                  color: theme === "dark" ? "#3b82f6" : "#2563eb",
                }
              }}
            >
              Role
            </InputLabel>
            <Select
              labelId="member-role-label"
              value={newMemberRole}
              label="Role"
              onChange={(e) => setNewMemberRole(e.target.value)}
              sx={{
                color: theme === "dark" ? "#fff" : "#000",
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === "dark" ? "#475569" : "#cbd5e1",
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === "dark" ? "#64748b" : "#94a3b8",
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === "dark" ? "#3b82f6" : "#2563eb",
                },
                '.MuiSvgIcon-root': {
                  color: theme === "dark" ? "#fff" : "#000",
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                  }
                }
              }}
            >
              <MenuItem value="user" sx={{ color: theme === "dark" ? "#fff" : "#000" }}>User</MenuItem>
              <MenuItem value="admin" sx={{ color: theme === "dark" ? "#fff" : "#000" }}>Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={() => {
              setAddMemberDialogOpen(false);
              setNewMemberEmail("");
              setNewMemberRole("user");
            }}
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
            onClick={handleAddMember}
            variant="contained"
            sx={{
              backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
              color: "#fff",
              '&:hover': {
                backgroundColor: theme === "dark" ? "#2563eb" : "#1d4ed8",
              }
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !isUpdating && setEditDialogOpen(false)}
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
          Update User Role
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '20px !important' }}>
          <FormControl fullWidth>
            <InputLabel
              id="role-select-label"
              sx={{ 
                color: theme === "dark" ? "#94a3b8" : "#64748b",
                '&.Mui-focused': {
                  color: theme === "dark" ? "#3b82f6" : "#2563eb",
                }
              }}
            >
              Role
            </InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              disabled={isUpdating}
              sx={{
                color: theme === "dark" ? "#fff" : "#000",
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === "dark" ? "#475569" : "#cbd5e1",
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === "dark" ? "#64748b" : "#94a3b8",
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === "dark" ? "#3b82f6" : "#2563eb",
                },
                '.MuiSvgIcon-root': {
                  color: theme === "dark" ? "#fff" : "#000",
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                  }
                }
              }}
            >
              <MenuItem value="user" sx={{ color: theme === "dark" ? "#fff" : "#000" }}>User</MenuItem>
              <MenuItem value="admin" sx={{ color: theme === "dark" ? "#fff" : "#000" }}>Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            disabled={isUpdating}
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
            onClick={handleUpdateRole}
            variant="contained"
            disabled={isUpdating}
            sx={{
              backgroundColor: theme === "dark" ? "#3b82f6" : "#2563eb",
              color: "#fff",
              '&:hover': {
                backgroundColor: theme === "dark" ? "#2563eb" : "#1d4ed8",
              },
              '&:disabled': {
                backgroundColor: "#9ca3af",
                color: "#fff",
              }
            }}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
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
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
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
}

export default AllUsers;