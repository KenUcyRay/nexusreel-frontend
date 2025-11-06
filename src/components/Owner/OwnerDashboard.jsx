import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { TrendingUp, TrendingDown, Film, Coffee, DollarSign, Home, LogOut } from 'lucide-react';
import SimpleLogout from '../SimpleLogout';
import RevenueChart from '../Admin/RevenueChart';

const OwnerDashboard = () => {
    const [reports, setReports] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        popularMovies: [],
        popularFoods: []
    });
    
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            // Get real revenue data from localStorage
            const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
            let totalIncome = 0;
            let movieRevenue = 0;
            let foodRevenue = 0;
            const movieStats = {};
            const foodStats = {};
            
            transactions.forEach(transaction => {
                if (transaction.payment_status === 'success') {
                    const amount = parseInt(transaction.totalPrice || 0);
                    totalIncome += amount;
                    
                    if (transaction.type === 'food') {
                        foodRevenue += amount;
                        transaction.items?.forEach(item => {
                            if (!foodStats[item.name]) {
                                foodStats[item.name] = 0;
                            }
                            foodStats[item.name] += item.quantity;
                        });
                    } else {
                        movieRevenue += amount;
                        const movieName = transaction.schedule?.movie?.title || transaction.schedule?.movie?.name;
                        if (movieName) {
                            if (!movieStats[movieName]) {
                                movieStats[movieName] = 0;
                            }
                            movieStats[movieName] += 1;
                        }
                    }
                }
            });
            
            // Convert to popular arrays
            const popularMovies = Object.entries(movieStats)
                .map(([title, bookings]) => ({ title, bookings }))
                .sort((a, b) => b.bookings - a.bookings)
                .slice(0, 5);
                
            const popularFoods = Object.entries(foodStats)
                .map(([name, orders]) => ({ name, orders }))
                .sort((a, b) => b.orders - a.orders)
                .slice(0, 5);
            
            setReports({
                totalIncome,
                totalExpenses: Math.floor(totalIncome * 0.3), // Estimate 30% expenses
                popularMovies,
                popularFoods
            });
            
            // Try to fetch from API as fallback
            try {
                const response = await api.get('/api/owner/dashboard');
                if (response.data) {
                    setReports(prev => ({ ...prev, ...response.data }));
                }
            } catch (apiError) {
                // API not available, use localStorage data
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
                            <h1 className="text-xl font-semibold text-gray-900">Owner Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name || 'Owner'}</span>
                            <SimpleLogout />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                                        <dd className="text-lg font-medium text-gray-900">Rp {reports.totalIncome?.toLocaleString()}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingDown className="h-6 w-6 text-red-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                                        <dd className="text-lg font-medium text-gray-900">Rp {reports.totalExpenses?.toLocaleString()}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Net Profit</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            Rp {(reports.totalIncome - reports.totalExpenses)?.toLocaleString()}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="mb-6">
                    <RevenueChart />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Film className="w-5 h-5 mr-2" />
                            Popular Movies
                        </h3>
                        <div className="space-y-3">
                            {reports.popularMovies?.length > 0 ? (
                                reports.popularMovies.map((movie, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">{movie.title}</span>
                                        <span className="text-sm text-gray-600">{movie.bookings} bookings</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-600">No data available</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Coffee className="w-5 h-5 mr-2" />
                            Popular Foods
                        </h3>
                        <div className="space-y-3">
                            {reports.popularFoods?.length > 0 ? (
                                reports.popularFoods.map((food, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="font-medium">{food.name}</span>
                                        <span className="text-sm text-gray-600">{food.orders} orders</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-600">No data available</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Reports</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                            <h4 className="font-medium text-gray-900">Income Report</h4>
                            <p className="text-sm text-gray-600">View detailed income breakdown</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                            <h4 className="font-medium text-gray-900">Expense Report</h4>
                            <p className="text-sm text-gray-600">View detailed expense breakdown</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;