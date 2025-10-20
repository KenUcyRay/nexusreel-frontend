import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import MovieManagement from './MovieManagement';

const AdminLayout = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'movies':
                return <MovieManagement />;
            case 'users':
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
                        <p className="text-gray-600">User management functionality coming soon...</p>
                    </div>
                );
            case 'food':
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Management</h2>
                        <p className="text-gray-600">Food management functionality coming soon...</p>
                    </div>
                );
            case 'bookings':
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Management</h2>
                        <p className="text-gray-600">Booking management functionality coming soon...</p>
                    </div>
                );
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