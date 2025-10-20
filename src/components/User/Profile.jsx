import React, { useEffect } from 'react';
import { User, Mail, Edit } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../ui/MainNavbar";

export default function Profile() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-80 sm:h-96 bg-gradient-to-r from-gray-900 to-gray-700 pt-28 sm:pt-40">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white text-center" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">My Profile</h1>
              <p className="text-lg sm:text-xl text-gray-300">Manage Your Account Information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">hamae</h2>
                  <p className="text-white/90">Premium Member</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#FFA500]" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold">rja@email.com</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-[#FFA500]" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold">January 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}