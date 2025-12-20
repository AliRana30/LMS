import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

const Footer = () => {
  const { theme } = useTheme()
  const year = new Date().getFullYear()
  

  return (
    <footer
      className={`w-full font-poppins border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Section */}
          <div className="space-y-4 mt-10">
            <h3 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              CampusCore
            </h3>
            <p className={`text-sm leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Empowering learners worldwide with quality education. Learn, grow, and succeed with us.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-[#37a39a] text-gray-400 hover:text-white'
                    : 'bg-gray-100 hover:bg-[#37a39a] text-gray-600 hover:text-white'
                }`}
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-[#37a39a] text-gray-400 hover:text-white'
                    : 'bg-gray-100 hover:bg-[#37a39a] text-gray-600 hover:text-white'
                }`}
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-[#37a39a] text-gray-400 hover:text-white'
                    : 'bg-gray-100 hover:bg-[#37a39a] text-gray-600 hover:text-white'
                }`}
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://github.com/AliRana30"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-[#37a39a] text-gray-400 hover:text-white'
                    : 'bg-gray-100 hover:bg-[#37a39a] text-gray-600 hover:text-white'
                }`}
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 mt-10">
            <h4 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', url: '/' },
                { name: 'Courses', url: '/courses' },
                { name: 'About', url: '/about' },
                { name: 'FAQ', url: '/faq' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    className={`text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-[#37a39a]'
                        : 'text-gray-600 hover:text-[#37a39a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 ">
            <h4 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Privacy Policy', url: '/policy' },
                { name: 'Terms of Service', url: '/policy' },
                { name: 'Cookie Policy', url: '/policy' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    className={`text-sm transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-[#37a39a]'
                        : 'text-gray-600 hover:text-[#37a39a]'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MdEmail className={`mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-[#37a39a]' : 'text-[#2d8b7f]'
                }`} size={18} />
                <a
                  href="mailto:support@campuscore.com"
                  className={`text-sm transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-[#37a39a]'
                      : 'text-gray-600 hover:text-[#37a39a]'
                  }`}
                >
                  support@campuscore.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MdPhone className={`mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-[#37a39a]' : 'text-[#2d8b7f]'
                }`} size={18} />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  +92 323 232 322
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MdLocationOn className={`mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-[#37a39a]' : 'text-[#2d8b7f]'
                }`} size={18} />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Lahore, Pakistan
                </span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
