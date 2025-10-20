import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import { Ticket, Coffee, Clock, CheckCircle } from 'lucide-react';
import SimpleLogout from '../SimpleLogout';

const CashierDashboard = () => {
    const [stats, setStats] = useState({
        todayBookings: 0,
        pendingBookings: 0,
        foodOrders: 0,
        totalSales: 0
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
            const response = await api.get('/api/kasir/dashboard');
            setStats(response.data);
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
                            <h1 className="text-xl font-semibold text-gray-900">Cashier Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name || 'Cashier'}</span>
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
                                    <Ticket className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Today's Bookings</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.todayBookings}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="h-6 w-6 text-yellow-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Bookings</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.pendingBookings}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Coffee className="h-6 w-6 text-green-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Food Orders</dt>
                                        <dd className="text-lg font-medium text-gray-900">{stats.foodOrders}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                                        <dd className="text-lg font-medium text-gray-900">Rp {stats.totalSales?.toLocaleString()}</dd>
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
                            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200">
                                <Ticket className="inline w-4 h-4 mr-2" />
                                Create Offline Booking
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-md border border-green-200">
                                <Coffee className="inline w-4 h-4 mr-2" />
                                Process Food Order
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-md border border-yellow-200">
                                <Clock className="inline w-4 h-4 mr-2" />
                                Process Online Bookings
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200">
                                <CheckCircle className="inline w-4 h-4 mr-2" />
                                Print Tickets
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
                        <div className="space-y-3">
                            <div className="text-sm text-gray-600">No scheduled shows for today</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="4">
                                        No recent transactions
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashierDashboard;