import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import MovieManagement from './MovieManagement';
import UserManagement from './UserManagement';
import ProfileAdmin from './ProfileAdmin';
import StudioManagement from './StudioManagement';
import ScheduleManagement from './ScheduleManagement';
import DiscountManagement from './DiscountManagement';

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
            case 'schedules':
                return <ScheduleManagement />;
            case 'discounts':
                return <DiscountManagement />;
            case 'bookings':
                return (
                    <div className="p-4 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Booking Management</h2>
                        <p className="text-gray-600">Booking management functionality coming soon...</p>
                    </div>
                );
            case 'profile':
                return <ProfileAdmin />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
            <AdminSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
            <div className="flex-1 lg:ml-64">
                <div className="pt-16 lg:pt-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;