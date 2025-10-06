import React, { useState, useEffect } from 'react';
import { Film, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, ChevronRight, Star, Ticket, Heart } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());
  const [hoveredSocial, setHoveredSocial] = useState(null);


  const socialLinks = [
    { icon: Facebook, name: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, name: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, name: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
    { icon: Youtube, name: 'Youtube', color: 'hover:bg-red-600' }
  ];

  const quickLinks = [
    'Now Showing', 'Coming Soon'
  ];



  return (
    <>
      {/* Remove any gap by using negative margin if needed */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-0 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            animation: 'slide 20s linear infinite'
          }}></div>
        </div>

        {/* Floating cinema elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 animate-pulse">
            <Ticket className="w-8 h-8 text-orange-400 opacity-20 rotate-12" />
          </div>
          <div className="absolute bottom-20 right-20 animate-pulse" style={{ animationDelay: '1s' }}>
            <Film className="w-10 h-10 text-yellow-400 opacity-20 -rotate-12" />
          </div>
          <div className="absolute top-1/2 left-1/4 animate-pulse" style={{ animationDelay: '2s' }}>
            <Star className="w-6 h-6 text-orange-300 opacity-20" />
          </div>
        </div>

        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF6B35]"></div>

        {/* Main footer content */}
        <div className="relative container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <img src={logo} alt="Logo" className="w-20 h-20" />
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                    Nexus Reel
                  </h3>
                  <p className="text-xs text-gray-400">Your Premium Movie Experience</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                Experience cinema like never before with state-of-the-art technology and ultimate comfort.
              </p>

              {/* Social media links */}
              <div className="flex space-x-2 pt-2">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className={`p-2 bg-gray-700/50 backdrop-blur-sm rounded-lg transition-all duration-300 transform hover:scale-110 ${social.color} hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <social.icon className={`w-4 h-4 ${hoveredSocial === index ? 'text-white' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-orange-400" />
                <span>Quick Links</span>
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="group flex items-center space-x-2 text-sm text-gray-300 hover:text-orange-400 transition-colors">
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Us</h4>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>Jl. Cinema Plaza No. 88, Bandung</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>+62 22 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>10:00 - 22:00 Daily</span>
                </div>
              </div>


            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 mt-6 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p className="text-sm text-gray-400">
                © {currentYear} Nexus Cinema. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a>
                <span className="text-gray-600">•</span>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Cookie Policy</a>
              </div>

              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                <span>for movie lovers</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(70px);
            }
          }
        `}</style>
      </footer>
    </>
  );
}