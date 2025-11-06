import React, { useState, useEffect } from 'react';
import { Menu, User, Film, MapPin, Calendar, Hamburger, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import logo from '../../assets/logo.png';
import homeIcon from '../../assets/home.png';
import aboutIcon from '../../assets/about.png';

// HistoryButton component for admin/owner
function HistoryButton() {
  const [hasTransactions, setHasTransactions] = useState(false);
  
  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
    setHasTransactions(transactions.length > 0);
  }, []);
  
  if (!hasTransactions) return null;
  
  return (
    <a href="/history" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
      History
    </a>
  );
}

export default function MainNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setIsMenuOpen(false);
      navigate('/login', { replace: true });
    }
  };

  const handleRoleNavigation = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'owner') {
      navigate('/owner/dashboard');
    } else if (user?.role === 'kasir') {
      navigate('/kasir/dashboard');
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      setUserProfile(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

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
            <a href="/" className={`flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium py-2 border-b-2 ${location.pathname === '/' ? 'border-[#FFA500] text-[#FFA500]' : 'border-transparent hover:border-gray-700'}`} style={{color: location.pathname === '/' ? '#FFA500 !important' : 'black !important'}}>
              <img src={homeIcon} alt="Home" className="w-10 h-10" />
              <span>Home</span>
            </a>
            <a href="/about" className={`flex items-center space-x-2 text-black hover:text-[#FFA500] transition-all font-medium py-2 border-b-2 ${location.pathname === '/about' ? 'border-[#FFA500] text-[#FFA500]' : 'border-transparent hover:border-gray-700'}`} style={{color: location.pathname === '/about' ? '#FFA500 !important' : 'black !important'}}>
              <img src={aboutIcon} alt="About" className="w-10 h-10" />
              <span>About</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <Menu className="w-4 h-4 text-gray-700" />
                {userProfile?.avatar ? (
                  <img 
                    src={`http://localhost:8000/storage/${userProfile.avatar}`} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <User className={`w-6 h-6 text-gray-700 bg-gray-500 rounded-full p-1 ${userProfile?.avatar ? 'hidden' : 'block'}`} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      
                      {user.role === 'user' && (
                        <>
                          <a href="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                            Profile
                          </a>
                          <a href="/history" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                            History
                          </a>
                        </>
                      )}
                      
                      {(user.role === 'kasir') && (
                        <a href="/history" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                          History
                        </a>
                      )}
                      
                      {(user.role === 'admin' || user.role === 'owner') && (
                        <HistoryButton />
                      )}
                      
                      {(user.role === 'admin' || user.role === 'owner' || user.role === 'kasir') && (
                        <button 
                          onClick={handleRoleNavigation}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                          Dashboard
                        </button>
                      )}
                      
                      <hr className="my-2 border-gray-200" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a href="/login" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                        Log in
                      </a>
                      <a href="/register" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                        Sign up
                      </a>
                    </>
                  )}
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
            <span className="text-lg font-bold text-[#FFA500] hidden sm:block">NexusVerse</span>
          </div>

          {/* Center menu - card style */}
          <div className={`flex items-center transition-all duration-300 overflow-x-auto ${
            isScrolled 
              ? 'space-x-4 sm:space-x-8' 
              : 'bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg'
          }`}>
            <a 
              href="/movies" 
              style={{color: location.pathname === '/movies' ? '#FFA500 !important' : 'black !important'}}
              className={`flex items-center space-x-1 sm:space-x-2 text-black hover:text-[#FFA500] transition-all font-medium whitespace-nowrap ${
                isScrolled 
                  ? `py-2 border-b-2 ${location.pathname === '/movies' ? 'border-[#FFA500]' : 'border-transparent hover:border-gray-700'}` 
                  : 'py-3 sm:py-4 px-3 sm:px-6 border-r border-gray-200'
              }`}
            >
              <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="flex flex-col">
                <span className="font-semibold text-xs sm:text-sm">Movies</span>
                {!isScrolled && <span className="text-xs text-gray-500 hidden sm:block">Films now showing and coming soon</span>}
              </div>
            </a>
            <a 
              href="/food" 
              style={{color: location.pathname === '/food' ? '#FFA500 !important' : 'black !important'}}
              className={`flex items-center space-x-1 sm:space-x-2 text-black hover:text-[#FFA500] transition-all font-medium whitespace-nowrap ${
                isScrolled 
                  ? `py-2 border-b-2 ${location.pathname === '/food' ? 'border-[#FFA500]' : 'border-transparent hover:border-gray-700'}` 
                  : 'py-3 sm:py-4 px-3 sm:px-6 border-r border-gray-200'
              }`}
            >
              <Hamburger className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="flex flex-col">
                <span className="font-semibold text-xs sm:text-sm">Foods</span>
                {!isScrolled && <span className="text-xs text-gray-500 hidden sm:block">Enjoy your movie with NexFood</span>}
              </div>
            </a>
            <a 
              href="/booking" 
              style={{color: location.pathname === '/booking' ? '#FFA500 !important' : 'black !important'}}
              className={`flex items-center space-x-1 sm:space-x-2 text-black hover:text-[#FFA500] transition-all font-medium whitespace-nowrap ${
                isScrolled 
                  ? `py-2 border-b-2 ${location.pathname === '/booking' ? 'border-[#FFA500]' : 'border-transparent hover:border-gray-700'}` 
                  : 'py-3 sm:py-4 px-3 sm:px-6'
              }`}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="flex flex-col">
                <span className="font-semibold text-xs sm:text-sm">Booking</span>
                {!isScrolled && <span className="text-xs text-gray-500 hidden sm:block">Reserve seats</span>}
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