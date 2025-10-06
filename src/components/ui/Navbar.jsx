import React, { useState } from 'react';
import { Menu, X, Film } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-25 h-25" />
        <span className="text-2xl font-bold text-gray-800">Nexus Reel</span>
        </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-[#FA812F] transition-colors font-medium">
              Home
            </a>
            <a href="/movies" className="text-gray-700 hover:text-[#FA812F] transition-colors font-medium">
              Movies
            </a>
            <a href="/cinemas" className="text-gray-700 hover:text-[#FA812F] transition-colors font-medium">
              Cinemas
            </a>
            <a href="/about" className="text-gray-700 hover:text-[#FA812F] transition-colors font-medium">
              About
            </a>
            <div className="flex space-x-3">
              <a
                href="/login"
                className="px-4 py-2 text-[#FA812F] border border-[#FA812F] rounded-lg hover:bg-[#FA812F] hover:text-white transition-colors"
              >
                Login
              </a>
              <a
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-[#FAB12F] to-[#FA812F] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Register
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#FA812F] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-[#FA812F] transition-colors">
                Home
              </a>
              <a href="/movies" className="block px-3 py-2 text-gray-700 hover:text-[#FA812F] transition-colors">
                Movies
              </a>
              <a href="/cinemas" className="block px-3 py-2 text-gray-700 hover:text-[#FA812F] transition-colors">
                Cinemas
              </a>
              <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-[#FA812F] transition-colors">
                About
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-center text-[#FA812F] border border-[#FA812F] rounded-lg hover:bg-[#FA812F] hover:text-white transition-colors"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 text-center bg-gradient-to-r from-[#FAB12F] to-[#FA812F] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}