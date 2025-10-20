import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import Toast from './ui/Toast';
import { useToast } from '../hooks/useToast';

const SimpleLogout = () => {
    const navigate = useNavigate();
    const { toast, showToast, hideToast } = useToast();

    const handleLogout = () => {
        // Simple logout - just clear tokens and redirect
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        showToast('Logged out successfully!', 'success');
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    const handleBackToWebsite = () => {
        navigate('/home');
    };

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={handleBackToWebsite}
                className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
            >
                <Home className="w-4 h-4 mr-2" />
                Back to Website
            </button>
            <button
                onClick={handleLogout}
                className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </button>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default SimpleLogout;