import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user, logout, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please login</div>;

    return (
        <div className="p-6">
            <h1>Welcome, {user.name}!</h1>
            <p>Role: {user.role}</p>
            <button 
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;