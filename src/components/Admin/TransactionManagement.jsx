import React, { useState, useEffect } from 'react';
import { Eye, Calendar, DollarSign, Package, Film, Coffee } from 'lucide-react';
import api from '../../utils/api';

const TransactionManagement = () => {
    const [transactions, setTransactions] = useState([]);
    const [movieTransactions, setMovieTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('food'); // 'food' or 'movie'
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTransactions: 0,
        todayRevenue: 0
    });

    useEffect(() => {
        loadTransactions();
        loadMovieTransactions();
        loadStats();
    }, []);

    const loadMovieTransactions = async () => {
        try {
            const response = await api.get('/api/admin/transactions/movie');
            if (response.data.success) {
                setMovieTransactions(response.data.data.transactions || response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to load movie transactions:', error);
        }
    };

    const loadTransactions = async () => {
        try {
            const response = await api.get('/api/admin/transactions/food');
            if (response.data.success) {
                setTransactions(response.data.data.transactions);
                if (response.data.data.stats) {
                    setStats({
                        totalRevenue: response.data.data.stats.total_revenue || 0,
                        totalTransactions: response.data.data.stats.total_transactions || 0,
                        todayRevenue: response.data.data.stats.today_revenue || 0
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.get('/api/admin/dashboard/food-stats');
            if (response.data.success) {
                const data = response.data.data;
                setStats({
                    totalRevenue: data.total_food_revenue || 0,
                    totalTransactions: data.total_food_transactions || 0,
                    todayRevenue: data.today_food_revenue || 0
                });
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const viewTransaction = async (transaction) => {
        try {
            const endpoint = activeTab === 'food' 
                ? `/api/admin/transactions/food/${transaction.id}`
                : `/api/admin/transactions/movie/${transaction.id}`;
            const response = await api.get(endpoint);
            if (response.data.success) {
                setSelectedTransaction(response.data.data);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Failed to load transaction details:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center py-8">
                    <p className="text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction Management</h2>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6">
                <button
                    onClick={() => setActiveTab('food')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'food'
                            ? 'bg-[#FFA500] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <Coffee className="w-4 h-4 inline mr-2" />
                    Food Transactions
                </button>
                <button
                    onClick={() => setActiveTab('movie')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'movie'
                            ? 'bg-[#FFA500] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <Film className="w-4 h-4 inline mr-2" />
                    Movie Transactions
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                Rp {stats.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <Package className="w-8 h-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <Calendar className="w-8 h-8 text-orange-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                Rp {stats.todayRevenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {activeTab === 'food' ? 'Items' : 'Movie & Seats'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(activeTab === 'food' ? transactions : movieTransactions)?.length > 0 ? (
                            (activeTab === 'food' ? transactions : movieTransactions).map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{transaction.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{transaction.customer_name}</div>
                                        <div className="text-sm text-gray-500">{transaction.customer_email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {activeTab === 'food' 
                                        ? `${transaction.items?.length || 0} item(s)`
                                        : `${transaction.movie?.title || 'N/A'} - ${transaction.seats?.join(', ') || 'N/A'}`
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    Rp {(transaction.total_amount || transaction.amount || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(transaction.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        transaction.status === 'success' || transaction.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : transaction.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => viewTransaction(transaction)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    No {activeTab} transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Transaction Detail Modal */}
            {showModal && selectedTransaction && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Transaction Details #{selectedTransaction.id}
                            </h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Customer</p>
                                    <p className="text-sm text-gray-900">{selectedTransaction.customer_name}</p>
                                    <p className="text-sm text-gray-500">{selectedTransaction.customer_email}</p>
                                </div>
                                
                                {activeTab === 'food' ? (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Items</p>
                                        {selectedTransaction.items?.map((item, index) => (
                                            <div key={index} className="text-sm text-gray-900">
                                                {item.food_name} x{item.quantity} - Rp {(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Movie Details</p>
                                        <p className="text-sm text-gray-900">{selectedTransaction.movie?.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {selectedTransaction.schedule?.show_date} - {selectedTransaction.schedule?.show_time}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Studio: {selectedTransaction.schedule?.studio?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Seats: {selectedTransaction.seats?.join(', ')}
                                        </p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Total Amount</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        Rp {(selectedTransaction.total_amount || selectedTransaction.amount || 0).toLocaleString()}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Status</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        selectedTransaction.status === 'success' || selectedTransaction.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : selectedTransaction.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Date</p>
                                    <p className="text-sm text-gray-900">{formatDate(selectedTransaction.created_at)}</p>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionManagement;