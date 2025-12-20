import React from 'react';
import { FaShieldAlt, FaUserShield, FaCookie, FaFileContract } from 'react-icons/fa';
import { MdSecurity, MdPrivacyTip, MdGavel } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';

const Policy = ({ theme }: { theme?: string }) => {

  const sections = [
    {
      icon: <MdPrivacyTip size={28} />,
      title: "Privacy Policy",
      content: [
        "We collect personal information including name, email, and payment details when you register or purchase courses.",
        "Your data is encrypted and stored securely on our servers with industry-standard security measures.",
        "We never share your personal information with third parties without your explicit consent.",
        "You have the right to request deletion of your data at any time by contacting our support team."
      ]
    },
    {
      icon: <FaFileContract size={28} />,
      title: "Terms of Service",
      content: [
        "By using CampusCore, you agree to follow our community guidelines and respect intellectual property rights.",
        "Course content is for personal use only and may not be redistributed or resold.",
        "We reserve the right to suspend or terminate accounts that violate our terms of service.",
        "Refund requests must be made within 30 days of purchase and are subject to review."
      ]
    },
    {
      icon: <FaCookie size={28} />,
      title: "Cookie Policy",
      content: [
        "We use cookies to enhance your browsing experience and remember your preferences.",
        "Essential cookies are required for the platform to function properly and cannot be disabled.",
        "Analytics cookies help us understand how users interact with our platform to improve services.",
        "You can manage cookie preferences through your browser settings at any time."
      ]
    },
    {
      icon: <FaUserShield size={28} />,
      title: "Data Protection",
      content: [
        "We comply with GDPR and other international data protection regulations.",
        "Your payment information is processed through secure, PCI-compliant payment gateways.",
        "We conduct regular security audits to ensure your data remains protected.",
        "In case of a data breach, affected users will be notified within 72 hours."
      ]
    }
  ];

  const highlights = [
    {
      icon: <FaShieldAlt size={24} />,
      title: "256-bit Encryption",
      description: "Bank-level security"
    },
    {
      icon: <MdSecurity size={24} />,
      title: "GDPR Compliant",
      description: "Full compliance"
    },
    {
      icon: <MdGavel size={24} />,
      title: "Transparent Terms",
      description: "Clear policies"
    }
  ];

  const downloadPDF = () => {
    // Create PDF content
    const pdfContent = `
CampusCore - Privacy Policy & Terms

Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${sections.map(section => `
${section.title}
${section.content.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}
`).join('\n\n')}

For more information, visit our website or contact support at support@campuscore.com
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CampusCore-Privacy-Policy.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`font-poppins w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Hero Section */}
      <div className="w-full pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
           
            <h1 className={`mt-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Our Policies
              <span className="block mt-3 bg-gradient-to-r from-[#37a39a] to-[#2d8b7f] bg-clip-text text-transparent">
                & Terms
              </span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We're committed to protecting your privacy and ensuring transparency in how we operate. 
              Read our policies to understand your rights and our responsibilities.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="w-full py-12 px-4 mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
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
                  {item.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`p-8 sm:p-10 rounded-3xl ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 shadow-xl'
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 rounded-xl flex-shrink-0 ${
                    theme === 'dark'
                      ? 'bg-[#37a39a]/10 text-[#37a39a]'
                      : 'bg-[#37a39a]/10 text-[#2d8b7f]'
                  }`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className={`text-2xl sm:text-3xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        theme === 'dark' ? 'bg-[#37a39a]' : 'bg-[#2d8b7f]'
                      }`} />
                      <p className={`text-base sm:text-lg leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl p-8 sm:p-12 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl'
              : 'bg-gradient-to-br from-[#37a39a]/5 to-blue-500/5 border border-[#37a39a]/20 shadow-xl'
          }`}>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Questions About Our Policies?
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              If you have any questions or concerns about our policies, please don't hesitate to reach out. 
              Our team is here to help you understand your rights and our commitments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className={`px-8 py-4 rounded-full font-semibold text-base hover:shadow-xl transition-all ${theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-700 hover:border-[#37a39a]'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-[#37a39a]'}`}>
                Contact Support
              </button>
              <button 
                onClick={downloadPDF}
                className={`px-8 py-4 rounded-full font-semibold text-base border-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-700 hover:border-[#37a39a]'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-[#37a39a]'
                }`}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Policy;
