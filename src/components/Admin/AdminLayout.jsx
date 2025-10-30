import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import MovieManagement from './MovieManagement';
import UserManagement from './UserManagement';
import ProfileAdmin from './ProfileAdmin';
import FoodManagement from './FoodManagement';
import TransactionManagement from './TransactionManagement';
import StudioManagement from './StudioManagement';
import ScheduleManagement from './ScheduleManagement';

const AdminLayout = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'studio':
                return <StudioManagement />;
            case 'movies':
                return <MovieManagement />;
            case 'users':
                return <UserManagement />;
            case 'food':
                return <FoodManagement />;
            case 'schedules':
                return <ScheduleManagement />;
            case 'bookings':
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Management</h2>
                        <p className="text-gray-600">Booking management functionality coming soon...</p>
                    </div>
                );
            case 'transactions':
                return <TransactionManagement />;
            case 'profile':
                return <ProfileAdmin />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
            <div className="flex-1 ml-64">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminLayout;