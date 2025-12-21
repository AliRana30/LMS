"use client"
import React, { useState, useEffect, useRef } from 'react'
import { ThemeSwitcher } from '../../utils/ThemeSwitcher'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import socketIO from "socket.io-client"
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from '@/redux/features/notifications/notificationsApi'

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

type Props = {
  open?: boolean;
  setOpen?: any;
  onMenuClick?: () => void;
}

const DashboardHeader = (props: Props) => {
  const [openNotifications, setOpenNotifications] = useState(false)
  const { user } = useSelector((state: any) => state.auth)
  const { theme } = useTheme()
  const notificationRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const socketRef = useRef<any>(null)
  const {data , refetch} = useGetAllNotificationsQuery(undefined , {refetchOnMountOrArgChange: true})
  const [updateNotificationStatus , {isSuccess}] = useUpdateNotificationStatusMutation({})
  const [notifications, setNotifications] = useState<any>([])

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error)
      })
    }
  }

  useEffect(() => {
    audioRef.current = new Audio('https://res.cloudinary.com/damk25wo5/video/upload/v1693465789/vctjn.mp3')
    audioRef.current.load()
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socketIO(ENDPOINT, { transports: ["websocket"] });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (data) {
      setNotifications(data.notifications.filter((n: any) => n.status === 'unread'))
    }
  },[data])

  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess, refetch])

  useEffect(()=>{
    if (!socketRef.current) return;

    socketRef.current.on("newNotification", (data: any) => {
      refetch()
      playNotificationSound()
    });

    socketRef.current.on("newReview", (data: any) => {
      refetch()
      playNotificationSound()
    });

    socketRef.current.on("newReply", (data: any) => {
      refetch()
      playNotificationSound()
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newNotification")
        socketRef.current.off("newReview")
        socketRef.current.off("newReply")
      }
    }
  },[refetch])

  const handleNotificationStatusChange = async (notificationId: string) => {
    try {
      await updateNotificationStatus(notificationId).unwrap()
      // Immediately remove the notification from local state
      setNotifications((prev: any[]) => prev.filter((n: any) => n._id !== notificationId))
    } catch (error) {
      console.error('Failed to update notification status:', error)
    }
  }

  const unreadCount = notifications.length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setOpenNotifications(false)
      }
    }

    if (openNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openNotifications])

  return (
    <div className={`w-full h-[80px] flex items-center justify-between px-4 md:px-8 border-b transition-colors duration-300 sticky top-0 z-30 ${
      theme === 'dark' 
        ? 'bg-slate-900 border-slate-700/50' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Hamburger Menu Button - Only visible on mobile/tablet */}
      <button
        onClick={props.onMenuClick}
        className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
          theme === 'dark'
            ? 'hover:bg-slate-800 text-slate-300'
            : 'hover:bg-gray-100 text-slate-700'
        }`}
      >
        <HiOutlineMenuAlt3 size={28} />
      </button>

      <div className='flex items-center gap-4 md:gap-6 ml-auto'>
        <ThemeSwitcher />

        <div className='relative' ref={notificationRef}>
          <div 
            className='relative cursor-pointer group'
            onClick={() => setOpenNotifications(!openNotifications)}
          >
            <IoMdNotificationsOutline 
              size={28} 
              className={`transition-all duration-300 ${
                theme === 'dark' 
                  ? 'text-slate-300 hover:text-white' 
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            />
            {unreadCount > 0 && (
              <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse ${
                theme === 'dark' ? 'bg-red-500' : 'bg-red-500'
              }`}>
                {unreadCount}
              </span>
            )}
          </div>

          {openNotifications && (
            <div className={`absolute top-12 right-0 w-[350px] rounded-xl shadow-2xl border z-50 overflow-hidden transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 border-b ${
                theme === 'dark' 
                  ? 'bg-slate-900/50 border-slate-700' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <div className='max-h-[400px] overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((notification: any) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationStatusChange(notification._id)}
                      className={`p-4 border-b transition-all duration-200 cursor-pointer ${
                        theme === 'dark'
                          ? 'border-slate-700 hover:bg-slate-700/50'
                          : 'border-gray-100 hover:bg-gray-50'
                      } ${
                        notification.status === 'unread' 
                          ? theme === 'dark' 
                            ? 'bg-blue-900/20' 
                            : 'bg-blue-50' 
                          : ''
                      }`}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1'>
                          <h4 className={`font-semibold text-sm mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-xs mb-2 leading-relaxed ${
                            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {notification.message}
                          </p>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            {notification.createdAt}
                          </span>
                        </div>
                        {notification.status === 'unread' && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0'></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='p-8 text-center'>
                    <IoMdNotificationsOutline 
                      size={48} 
                      className={`mx-auto mb-3 ${
                        theme === 'dark' ? 'text-slate-600' : 'text-gray-300'
                      }`}
                    />
                    <p className={`${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      No notifications yet
                    </p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className={`p-3 text-center border-t ${
                  theme === 'dark' 
                    ? 'bg-slate-900/50 border-slate-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <button className={`text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}>
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {user && (
          <Link href="/profile" className='group'>
            {user?.avatar?.url ? (
              <div className='relative'>
                <Image
                  src={user.avatar.url}
                  alt={user.name || 'User avatar'}
                  width={40}
                  height={40}
                  className={`rounded-full cursor-pointer border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-slate-600 group-hover:border-blue-500'
                      : 'border-gray-300 group-hover:border-blue-500'
                  }`}
                  style={{ objectFit: 'cover' }}
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                  theme === 'dark'
                    ? 'bg-green-500 border-slate-900'
                    : 'bg-green-500 border-white'
                }`}></div>
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 group-hover:border-blue-500'
                  : 'bg-gray-200 border-gray-300 group-hover:border-blue-500'
              }`}>
                <span className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </Link>
        )}
      </div>
    </div>
  )
}

export default DashboardHeader