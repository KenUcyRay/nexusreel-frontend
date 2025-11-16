import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export default function LogoutButton({ className = "", children }) {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('🔄 Logout button clicked for user:', user?.email);
      
      // Call logout function which clears state
      await logout();
      
      // Force navigation to login page
      console.log('🔄 Navigating to login page...');
      navigate('/login', { replace: true });
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if logout fails, clear state and redirect
      navigate('/login', { replace: true });
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || "flex items-center text-red-600 hover:text-red-800 transition-colors"}
    >
      {children || (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </>
      )}
    </button>
  );
}