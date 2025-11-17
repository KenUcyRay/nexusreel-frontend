import React, { useState, useEffect } from 'react';
import { Film, Users, Calendar, Home, LogOut, ArrowLeft, MonitorCog, User, DoorOpen, Menu, X, Percent, BarChart3 } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const AdminSidebar = ({ activeMenu, onMenuChange }) => {
    const { user, logout } = useAuthContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'studio', label: 'Manage Studio', icon: DoorOpen },
        { id: 'movies', label: 'Manage Movies', icon: Film },
        { id: 'users', label: 'Manage Users', icon: Users },
        { id: 'schedules', label: 'Manage Schedule', icon: Calendar },
        { id: 'discounts', label: 'Manage Discounts', icon: Percent },
    ];

    const handleMenuClick = (menuId) => {
        onMenuChange(menuId);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white p-2 rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 backdrop-blur-md bg-black/20 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`w-64 bg-gradient-to-br from-white to-[#C6E7FF] shadow-lg h-screen fixed left-0 top-0 z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
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
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </span>
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
                                        onClick={() => handleMenuClick(item.id)}
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
                        onClick={() => handleMenuClick('profile')}
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
        </>
    );
};

export default AdminSidebar;