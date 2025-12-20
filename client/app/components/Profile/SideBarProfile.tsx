import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'

import { RiLockPasswordLine } from 'react-icons/ri'
import { SiCoursera } from 'react-icons/si'
import { AiOutlineLogout } from 'react-icons/ai'
import {
  MdOutlineAdminPanelSettings,
  MdOutlineAccountCircle,
} from 'react-icons/md'

type Props = {
  user: any
  active: number
  setActive: (active: number) => void
  logoutHandler: () => void
}

const SideBarProfile: FC<Props> = ({
  user,
  active,
  setActive,
  logoutHandler,
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={`w-full rounded-xl shadow-lg font-poppins ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="hidden lg:block">
        <div
          className={`flex flex-col items-center py-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
      
          <div
            className={`mt-3 px-4 py-2 rounded-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {user?.courses?.length || 0} Courses Enrolled
            </p>
          </div>
        </div>

        <div className="py-4 ">
          <MenuItem
            icon={<MdOutlineAccountCircle size={22} />}
            text="My Account"
            active={active === 1}
            onClick={() => setActive(1)}
            isDark={isDark}
          />

          <MenuItem
            icon={<RiLockPasswordLine size={22} />}
            text="Change Password"
            active={active === 2}
            onClick={() => setActive(2)}
            isDark={isDark}
          />

          <MenuItem
            icon={<SiCoursera size={22} />}
            text="Enrolled Courses"
            active={active === 3}
            onClick={() => setActive(3)}
            isDark={isDark}
          />

          {user?.role === 'admin' && (
            <Link href="/admin">
              <MenuItem
                icon={<MdOutlineAdminPanelSettings size={22} />}
                text="Admin Dashboard"
                active={active === 4}
                onClick={() => setActive(4)}
                isDark={isDark}
              />
            </Link>
          )}

          <MenuItem
            icon={<AiOutlineLogout size={22} />}
            text="Logout"
            active={false}
            onClick={logoutHandler}
            isDark={isDark}
          />
        </div>
      </div>

      <div className="flex flex-col items-center py-6 gap-4 lg:hidden">
        <IconButton
          icon={<MdOutlineAccountCircle size={26} />}
          active={active === 1}
          onClick={() => setActive(1)}
          isDark={isDark}
        />

        <IconButton
          icon={<RiLockPasswordLine size={26} />}
          active={active === 2}
          onClick={() => setActive(2)}
          isDark={isDark}
        />

        <IconButton
          icon={<SiCoursera size={26} />}
          active={active === 3}
          onClick={() => setActive(3)}
          isDark={isDark}
        />

        {user?.role === 'admin' && (
          <Link href="/admin">
            <IconButton
              icon={<MdOutlineAdminPanelSettings size={26} />}
              active={active === 4}
              onClick={() => setActive(4)}
              isDark={isDark}
            />
          </Link>
        )}

        <IconButton
          icon={<AiOutlineLogout size={26} />}
          active={false}
          onClick={logoutHandler}
          isDark={isDark}
        />
      </div>
    </div>
  )
}

const MenuItem: FC<{
  icon: React.ReactNode
  text: string
  active: boolean
  onClick: () => void
  isDark: boolean
}> = ({ icon, text, active, onClick, isDark }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-all ${
      active
        ? 'bg-[#37a39a]/15 border-l-4 border-[#37a39a]'
        : isDark
        ? 'hover:bg-gray-700'
        : 'hover:bg-gray-100'
    }`}
  >
    <span
      className={
        active
          ? 'text-[#37a39a]'
          : isDark
          ? 'text-gray-400'
          : 'text-gray-600'
      }
    >
      {icon}
    </span>

    <span
      className={`font-medium ${
        active
          ? 'text-[#37a39a]'
          : isDark
          ? 'text-white'
          : 'text-gray-900'
      }`}
    >
      {text}
    </span>
  </div>
)

const IconButton: FC<{
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  isDark: boolean
}> = ({ icon, active, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl transition-all ${
      active
        ? 'bg-[#37a39a] text-white shadow-md'
        : isDark
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {icon}
  </button>
)

export default SideBarProfile
