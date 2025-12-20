"use client"
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode, FaRocket, FaHeart, FaGraduationCap } from 'react-icons/fa';
import { MdLightbulb, MdPeople, MdTrendingUp } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';

const About = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: <FaGraduationCap size={28} />,
      title: "Quality Education",
      description: "Access world-class courses designed by industry experts to help you master new skills"
    },
    {
      icon: <MdPeople size={28} />,
      title: "Community Driven",
      description: "Learn alongside thousands of students in an engaging and supportive environment"
    },
    {
      icon: <MdTrendingUp size={28} />,
      title: "Career Growth",
      description: "Build practical skills that employers value and accelerate your career"
    },
    {
      icon: <MdLightbulb size={28} />,
      title: "Innovation First",
      description: "Stay ahead with cutting-edge content updated regularly to match industry trends"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Courses" },
    { number: "50+", label: "Expert Instructors" },
    { number: "95%", label: "Success Rate" }
  ];


  return (
    <div className={`font-poppins w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} suppressHydrationWarning>
      
      {/* Hero Section */}
      <div className="w-full pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className={`mt-10 text-4xl sm:text-3xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Empowering Learners
              <span className="block mt-3 bg-gradient-to-r from-[#37a39a] to-[#2d8b7f] bg-clip-text text-transparent">
                Worldwide
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We're on a mission to democratize education and make learning accessible to everyone, 
              everywhere. Join thousands of students transforming their careers through quality online education.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full mt-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 shadow-xl' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <div className="text-3xl sm:text-4xl lg:text-3xl font-bold mb-2 text-[#37a39a]">
                  {stat.number}
                </div>
                <div className={`text-sm sm:text-base font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose Us?
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto px-4 mb-10 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              We combine cutting-edge technology with expert instruction to deliver exceptional learning experiences
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700 shadow-xl' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <div className={`inline-flex p-4 rounded-xl mb-4 ${
                  theme === 'dark' 
                    ? 'bg-[#37a39a]/10 text-[#37a39a]' 
                    : 'bg-[#37a39a]/10 text-[#2d8b7f]'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg sm:text-xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className={`w-full py-16 px-4 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
      }`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl sm:text-4xl md:text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Meet the Developer
            </h2>
            <p className={`text-base sm:text-lg mb-10 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Built with passion and dedication
            </p>
          </div>

          <div className={`rounded-3xl p-8 sm:p-12 ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700 shadow-2xl' 
              : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-2xl'
          }`}>
            <div className="flex flex-col items-center gap-8">

              {/* Info */}
              <div className="flex-1 text-center w-full">
                <h3 className={`text-3xl sm:text-4xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Ali Mahmood
                </h3>
                <p className="text-lg sm:text-xl text-[#37a39a] font-semibold mb-6">
                  Full Stack Developer & Creator
                </p>
                <p className={`text-base sm:text-lg leading-relaxed mb-8 max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Passionate about creating innovative learning solutions that empower individuals to reach their full potential. 
                  With expertise in modern web technologies, I built this platform to bridge the gap between quality education 
                  and accessibility.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <FaCode className="text-[#37a39a]" size={16} />
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      React & Next.js
                    </span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <FaRocket className="text-[#37a39a]" size={16} />
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Node.js & MongoDB
                    </span>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <FaHeart className="text-red-500" size={16} />
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Built with Love
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href="https://github.com/AliRana30" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    <FaGithub size={20} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/ali-mahmood-rana-7093322a7/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a 
                    href="mailto:alimahmoodrana82@gmail.com" 
                    className={`p-3 rounded-full transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    <FaEnvelope size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl p-8 sm:p-12 text-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl' 
              : 'bg-gradient-to-br from-[#37a39a]/5 to-blue-500/5 border border-[#37a39a]/20 shadow-xl'
          }`}>
            <h2 className={`text-3xl sm:text-4xl md:text-3xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Our Mission
            </h2>
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              To create a world where quality education is accessible to everyone, regardless of location or background. 
              We believe that learning should be engaging, practical, and transformative.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-[#37a39a] to-[#2d8b7f] text-white rounded-full font-semibold text-base hover:shadow-xl transition-all">
              Join Our Community
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;