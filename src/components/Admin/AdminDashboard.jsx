import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { Film, Users, DoorOpen, DollarSign, Coffee } from 'lucide-react';
import RevenueChart from './RevenueChart';
import SimpleLogout from '../SimpleLogout';
import studioService from '../../services/studioService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalUsers: 0,
        totalStudios: 0,
        totalFoodItems: 0,
        totalRevenue: 0,
    });
    
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [recentActivities, setRecentActivities] = useState([]);
    
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
            let movies = [];
            if (Array.isArray(moviesResponse.data)) {
                movies = moviesResponse.data;
            } else if (moviesResponse.data && Array.isArray(moviesResponse.data.data)) {
                movies = moviesResponse.data.data;
            }
            const totalMovies = movies.length;
            
            // Fetch users count
            let totalUsers = 0;
            try {
                const usersResponse = await api.get('/api/admin/users');
                totalUsers = usersResponse.data.length;
            } catch (usersError) {
                // Users endpoint not available
                totalUsers = 0;
            }
            
            // Fetch food count
            let totalFoodItems = 0;
            try {
                const foodResponse = await api.get('/api/admin/foods');
                totalFoodItems = foodResponse.data.length;
            } catch (foodError) {
                // Food endpoint not available
                totalFoodItems = 0;
            }
            
            // Fetch studios count
            let totalStudios = 0;
            try {
                const studiosResponse = await studioService.getStudios();
                totalStudios = studiosResponse.data.data?.length || 0;
            } catch (studiosError) {
                // Studios endpoint not available - set default value
                totalStudios = 0;
            }
            
            // Generate recent activities based on data
            const activities = [];
            if (movies.length > 0) {
                const latestMovies = movies.slice(-3);
                latestMovies.forEach(movie => {
                    activities.push({
                        id: `movie-${movie.id}`,
                        type: 'movie',
                        action: 'created',
                        item: movie.name,
                        time: 'Recently'
                    });
                });
            }
            
            try {
                const foodResponse = await api.get('/api/admin/foods');
                if (foodResponse.data.length > 0) {
                    const latestFood = foodResponse.data.slice(-2);
                    latestFood.forEach(food => {
                        activities.push({
                            id: `food-${food.id}`,
                            type: 'food',
                            action: 'created',
                            item: food.name,
                            time: 'Recently'
                        });
                    });
                }
            } catch (foodError) {
                // Food endpoint not available
            }
            
            setRecentActivities(activities.slice(-5)); // Show last 5 activities
            
            // Calculate revenue from localStorage
            const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
            const totalRevenue = transactions
                .filter(t => t.payment_status === 'success')
                .reduce((sum, t) => sum + parseInt(t.totalPrice || 0), 0);
            
            // Try to fetch other dashboard data, fallback to counts only
            try {
                const dashboardResponse = await api.get('/api/admin/dashboard');
                setStats({
                    ...dashboardResponse.data.data,
                    totalMovies,
                    totalUsers,
                    totalFoodItems,
                    totalStudios,
                    totalRevenue
                });
            } catch (dashboardError) {
                // If dashboard endpoint doesn't exist, just set counts
                setStats(prevStats => ({
                    ...prevStats,
                    totalMovies,
                    totalUsers,
                    totalFoodItems,
                    totalStudios,
                    totalRevenue
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
            
            <div className="p-8">
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
                                <Coffee className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Food</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalFoodItems}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DoorOpen className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Studios</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalStudios}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DollarSign className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                    <dd className="text-lg font-medium text-gray-900">Rp {stats.totalRevenue.toLocaleString('id-ID')}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="mb-8">
                <RevenueChart />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    activity.type === 'movie' 
                                        ? 'bg-blue-100 text-blue-600' 
                                        : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {activity.type === 'movie' ? (
                                        <Film className="w-4 h-4" />
                                    ) : (
                                        <Coffee className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.type === 'movie' ? 'Movie' : 'Food'} {activity.action}: {activity.item}
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-600">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminDashboard;