import React, { useState, useEffect } from 'react';
import { Menu, User, Film, MapPin, Calendar } from 'lucide-react';
import logo from '../../assets/logo.png';
import homeIcon from '../../assets/home.png';
import aboutIcon from '../../assets/about.png';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row - hidden when scrolled */}
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-20'
        }`}>
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-black">NexusVerse</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium py-2 border-b-2 border-transparent hover:border-gray-700" style={{color: 'black !important'}}>
              <img src={homeIcon} alt="Home" className="w-10 h-10" />
              <span>Home</span>
            </a>
            <a href="/about" className="flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium py-2 border-b-2 border-transparent hover:border-gray-700" style={{color: 'black !important'}}>
              <img src={aboutIcon} alt="About" className="w-10 h-10" />
              <span>About</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-3 hover:shadow-md transition-shadow"
              >
                <Menu className="w-4 h-4 text-gray-700" />
                <User className="w-6 h-6 text-gray-700 bg-gray-500 rounded-full p-1" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <a href="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                    Log in
                  </a>
                  <a href="/register" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                    Sign up
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom row - card style when not scrolled, compact when scrolled */}
        <div className={`flex items-center justify-center transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}>
          {/* Logo - visible when scrolled */}
          <div className={`absolute left-4 flex items-center space-x-2 transition-all duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <img src={logo} alt="Logo" className="w-7 h-7" />
            <span className="text-lg font-bold text-[#FFA500]">NexusVerse</span>
          </div>

          {/* Center menu - card style */}
          <div className={`flex items-center transition-all duration-300 ${
            isScrolled 
              ? 'space-x-8' 
              : 'bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg'
          }`}>
            <a 
              href="/movies" 
              style={{color: 'black !important'}}
              className={`flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium ${
                isScrolled 
                  ? 'py-2 border-b-2 border-gray-700' 
                  : 'py-4 px-6 border-r border-gray-200'
              }`}
            >
              <Film className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Movies</span>
                {!isScrolled && <span className="text-xs text-gray-500">Films now showing and coming soon</span>}
              </div>
            </a>
            <a 
              href="/cinemas" 
              style={{color: 'black !important'}}
              className={`flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium ${
                isScrolled 
                  ? 'py-2 border-b-2 border-transparent hover:border-gray-700' 
                  : 'py-4 px-6 border-r border-gray-200'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Studio</span>
                {!isScrolled && <span className="text-xs text-gray-500">Find comfortable studios</span>}
              </div>
            </a>
            <a 
              href="/booking" 
              style={{color: 'black !important'}}
              className={`flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium ${
                isScrolled 
                  ? 'py-2 border-b-2 border-transparent hover:border-gray-700' 
                  : 'py-4 px-6'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Booking</span>
                {!isScrolled && <span className="text-xs text-gray-500">Reserve seats</span>}
              </div>
            </a>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}