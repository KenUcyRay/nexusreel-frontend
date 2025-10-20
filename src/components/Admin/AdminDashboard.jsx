import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { Film, Users, Calendar, DollarSign, Coffee } from 'lucide-react';
import SimpleLogout from '../SimpleLogout';
import MovieManagement from './MovieManagement';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0
    });
    
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    
    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            // Fetch movies count
            const moviesResponse = await api.get('/api/admin/movies');
            const totalMovies = moviesResponse.data.length;
            
            // Try to fetch other dashboard data, fallback to movies count only
            try {
                const dashboardResponse = await api.get('/api/admin/dashboard');
                setStats({
                    ...dashboardResponse.data,
                    totalMovies
                });
            } catch (dashboardError) {
                // If dashboard endpoint doesn't exist, just set movies count
                setStats(prevStats => ({
                    ...prevStats,
                    totalMovies
                }));
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name || 'Admin'}</span>
                            <SimpleLogout />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Film className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Movies</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.totalMovies}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Calendar className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.totalBookings}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                        <dd className="text-lg font-medium text-gray-900">Rp {stats.totalRevenue?.toLocaleString()}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => setCurrentView('movies')}
                                className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md"
                            >
                                <Film className="inline w-4 h-4 mr-2" />
                                Manage Movies
                            </button>
                            <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md">
                                <Users className="inline w-4 h-4 mr-2" />
                                Manage Users
                            </button>
                            <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md">
                                <Calendar className="inline w-4 h-4 mr-2" />
                                Manage Seat
                            </button>
                            <button className="w-full text-left px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-md">
                                <Coffee className="inline w-4 h-4 mr-2" />
                                Manage Food
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">No recent activity</div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Movie Management Modal */}
            {currentView === 'movies' && (
                <div className="fixed inset-0 bg-white z-50">
                    <div className="p-4">
                        <button 
                            onClick={() => {
                                setCurrentView('dashboard');
                                fetchDashboardData(); // Refresh dashboard data
                            }}
                            className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            ← Back to Dashboard
                        </button>
                        <MovieManagement onMovieChange={fetchDashboardData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;