import React, { useState, useEffect } from 'react';
import { Film, Users, Coffee, Calendar, Home, LogOut, ArrowLeft, MonitorCog, User, CreditCard, DoorOpen, CircleDollarSign } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const AdminSidebar = ({ activeMenu, onMenuChange }) => {
    const { user, logout } = useAuthContext();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);

    const loadUserProfile = async () => {
        try {
            const response = await api.get('/api/profile');
            setUserProfile(response.data);
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'studio', label: 'Manage Studio', icon: DoorOpen },
        { id: 'movies', label: 'Manage Movies', icon: Film },
        { id: 'users', label: 'Manage Users', icon: Users },
        { id: 'food', label: 'Manage Food', icon: Coffee },
        { id: 'bookings', label: 'Manage Schedule', icon: Calendar },
        { id: 'transactions', label: 'Manage Transactions', icon: CircleDollarSign },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#FFD700] bg-opacity-20 rounded-lg flex items-center justify-center">
                        <MonitorCog className="w-5 h-5 text-grey" />
                    </div>
                    <div>
                        <h2 className="text-white font-semibold text-sm">Admin Panel</h2>
                        <p className="text-white text-opacity-80 text-xs">Nexus Cinema</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        {userProfile?.avatar ? (
                            <img 
                                src={`http://localhost:8000/storage/${userProfile.avatar}`} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className={`w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center ${userProfile?.avatar ? 'hidden' : 'flex'}`}>
                            <span className="text-white font-semibold text-xs">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items - Scrollable */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;
                        
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onMenuChange(item.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Back to Website & Logout */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-2">
                <a
                    href="/"
                    className="w-full flex items-center space-x-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium text-sm">Back to Website</span>
                </a>
                <button
                    onClick={() => onMenuChange('profile')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-orange-400 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                    <User className="w-4 h-4" />
                    <span className="font-medium text-sm">Profile</span>
                </button>
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;