import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, Film, MapPin, Clock } from 'lucide-react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [data, setData] = useState({
    today: 0,
    thisMonth: 0,
    total: 0,
    totalPurchases: 0,
    todayPurchases: 0,
    monthlyPurchases: 0,
    totalStudios: 0,
    totalMovies: 0,
    totalSchedules: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/dashboard/admin');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Admin Dashboard</h1>
        
        {/* Revenue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Rp {data.today.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Rp {data.thisMonth.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Overall</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Rp {data.total.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Purchases</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.totalPurchases}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Today's Purchases</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.todayPurchases}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Monthly Purchases</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.monthlyPurchases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mr-2 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Studios</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.totalStudios}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mr-2 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Movies</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.totalMovies}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mr-2 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Schedules</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{data.totalSchedules}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          
          {data.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction No.
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {transaction.order_id}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {transaction.customer_name}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status === 'success' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}