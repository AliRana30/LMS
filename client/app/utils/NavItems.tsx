import React, { FC } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

type Props = {
  activeItem: number
  isMobile: boolean
}

export const navItemsData = [
  {
    name: "Home",
    url: "/"
  },
  {
    name: "Courses",
    url: "/courses"
  },
  {
    name: "About",
    url: "/about"
  },
  {
    name: "Policy",
    url: "/policy"
  },
  {
    name: "FAQ",
    url: "/faq"
  }
]

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
  const { theme } = useTheme()

  return (
    <>
      <div className='hidden md:flex'>
        {navItemsData.map((item, index) => (
          <Link href={item.url} key={index} passHref>
            <span
              className={`${
                activeItem === index
                  ? "text-[#37a39a]"
                  : theme === 'dark' ? "text-white" : "text-gray-900"
              } text-[18px] px-6 font-poppins font-[400] cursor-pointer hover:text-[#37a39a] transition-colors duration-300`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {isMobile && (
        <div className='md:hidden mt-5'>
          {navItemsData.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "text-[#37a39a]"
                    : theme === 'dark' ? "text-white" : "text-gray-900"
                } block py-5 text-[18px] px-6 font-poppins font-[400] cursor-pointer hover:text-[#37a39a] transition-colors duration-300`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default NavItems