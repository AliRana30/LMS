"use client"
import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import {
    Home,
    Users,
    FileText,
    BookOpen,
    Video,
    Award,
    HelpCircle,
    FolderOpen,
    UsersRound,
    BarChart3,
    ListOrdered,
    Users2,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useLogOutQuery } from '@/redux/features/api/apiSlice';

interface User {
    name?: string;
    role?: string;
    avatar?: {
        url?: string;
    };
}

interface AdminSidebarProps {
    user?: User;
}

const AdminSidebar = ({ user }: AdminSidebarProps) => {
    const { theme } = useTheme();
    const pathname: any = usePathname();
    const router = useRouter();
    const [activeItem, setActiveItem] = useState('dashboard');
    const [mounted, setMounted] = useState(false);
    const [logout, setLogout] = useState(false);
    
    const {refetch , isSuccess, error } = useLogOutQuery(undefined, {
        skip: !logout
    });

    const handleLogout = async() => {
        setLogout(true);
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isSuccess) {
            signOut({ redirect: false }).then(() => {
                refetch()
                toast.success("Logged out successfully!");
                router.push("/");
                router.refresh();
            });
        }
        
        if (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
            setLogout(false);
        }
    }, [isSuccess, error, router]);
    
    useEffect(() => {
        if (pathname === '/admin') {
            setActiveItem('dashboard');
        } else if (pathname === '/admin/users') {
            setActiveItem('users');
        } else if (pathname === '/admin/invoices') {
            setActiveItem('invoices');
        } else if (pathname === '/admin/create-course') {
            setActiveItem('create-course');
        } else if (pathname === '/admin/courses-analytics') {
            setActiveItem('courses-analytics');
        } else if (pathname === '/admin/orders-analytics') {
            setActiveItem('orders-analytics');
        } else if (pathname === '/admin/users-analytics') {
            setActiveItem('users-analytics');
        } else if (pathname === '/admin/courses') {
            setActiveItem('live-courses');
        } else if (pathname === '/admin/hero') {
            setActiveItem('hero');
        } else if (pathname === '/admin/faq') {
            setActiveItem('faq');
        } else if (pathname === '/admin/categories') {
            setActiveItem('categories');
        } else if (pathname === '/admin/team') {
            setActiveItem('manage-team');
        }
    }, [pathname]);

    const isDark = theme === 'dark';

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex h-screen font-poppins fixed z-50">
            <Sidebar
                backgroundColor={isDark ? '#1e293b' : '#ffffff'}
                width="280px"
                style={{
                    height: '100vh',
                    border: 'none',
                    borderRight: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
                }}
            >
                <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <h1 className={`text-2xl font-bold tracking-wide mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Link href='/'>
                            CampusCore
                        </Link>
                    </h1>
                    <div className="flex flex-col items-center">
                        <div>
                            {user?.avatar?.url ? (
                                <Image 
                                    src={user.avatar.url} 
                                    alt="User Avatar" 
                                    width={80} 
                                    height={80} 
                                    className="w-20 h-20 rounded-full border-4 border-blue-400 object-cover mb-3" 
                                />
                            ) : (
                                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-3 ${
                                    isDark ? 'border-blue-400 bg-slate-700' : 'border-blue-500 bg-slate-100'
                                }`}>
                                    <Users className={`w-10 h-10 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                                </div>
                            )}
                        </div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'Admin'}</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>- {user?.role || 'Admin'}</p>
                    </div>
                </div>

                <Menu
                    menuItemStyles={{
                        button: ({ active }) => ({
                            color: active 
                                ? (isDark ? '#60a5fa' : '#2563eb') 
                                : (isDark ? '#94a3b8' : '#64748b'),
                            padding: '12px 24px',
                            backgroundColor: active 
                                ? (isDark ? '#334155' : '#eff6ff')
                                : 'transparent',
                            '&:hover': {
                                backgroundColor: isDark ? '#334155' : '#f1f5f9',
                                color: isDark ? '#ffffff' : '#1e293b'
                            }
                        })
                    }}
                >
                    <MenuItem
                        icon={<Home size={20} />}
                        active={activeItem === 'dashboard'}
                        component={<Link href="/admin" />}
                    >
                        Dashboard
                    </MenuItem>

                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Data
                        </p>
                    </div>

                    <MenuItem
                        icon={<Users size={20} />}
                        active={activeItem === 'users'}
                        component={<Link href="/admin/users" />}
                    >
                        Users
                    </MenuItem>

                    <MenuItem
                        icon={<FileText size={20} />}
                        active={activeItem === 'invoices'}
                        component={<Link href="/admin/invoices" />}
                    >
                        Invoices
                    </MenuItem>

                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Content
                        </p>
                    </div>

                    <MenuItem
                        icon={<BookOpen size={20} />}
                        active={activeItem === 'create-course'}
                        component={<Link href="/admin/create-course" />}
                    >
                        Create Course
                    </MenuItem>

                    <MenuItem
                        icon={<Video size={20} />}
                        active={activeItem === 'live-courses'}
                        component={<Link href="/admin/courses" />}
                    >
                        Live Courses
                    </MenuItem>

                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Customization
                        </p>
                    </div>

                    <MenuItem
                        icon={<Award size={20} />}
                        active={activeItem === 'hero'}
                        component={<Link href="/admin/hero" />}
                    >
                        Hero
                    </MenuItem>

                    <MenuItem
                        icon={<HelpCircle size={20} />}
                        active={activeItem === 'faq'}
                        component={<Link href="/admin/faq" />}
                    >
                        FAQ
                    </MenuItem>

                    <MenuItem
                        icon={<FolderOpen size={20} />}
                        active={activeItem === 'categories'}
                        component={<Link href="/admin/categories" />}
                    >
                        Categories
                    </MenuItem>

                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Controllers
                        </p>
                    </div>

                    <MenuItem
                        icon={<UsersRound size={20} />}
                        active={activeItem === 'manage-team'}
                        component={<Link href="/admin/team" />}
                    >
                        Manage Team
                    </MenuItem>

                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Analytics
                        </p>
                    </div>

                    <MenuItem
                        icon={<BarChart3 size={20} />}
                        active={activeItem === 'courses-analytics'}
                        component={<Link href="/admin/courses-analytics" />}
                    >
                        Courses Analytics
                    </MenuItem>
                    
                    <MenuItem
                        icon={<ListOrdered size={20} />}
                        active={activeItem === 'orders-analytics'}
                        component={<Link href="/admin/orders-analytics" />}
                    >
                        Orders Analytics
                    </MenuItem>
                    
                    <MenuItem
                        icon={<Users2 size={20} />}
                        active={activeItem === 'users-analytics'}
                        component={<Link href="/admin/users-analytics" />}
                    >
                        Users Analytics
                    </MenuItem>

                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                            Extras
                        </p>
                    </div>
                    
                    <MenuItem
                        icon={<LogOut size={20} />}
                        active={activeItem === 'log-out'}
                        component={<Link href="/" />}
                    >
                       <button className='cursor-pointer' onClick={handleLogout}>
                             Log Out
                       </button>
                    </MenuItem>
                </Menu>
            </Sidebar>
        </div>
    );
};

export default AdminSidebar;