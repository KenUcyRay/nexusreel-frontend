import React, { useState, useEffect } from 'react';
import { Ticket, DollarSign, Plus, Clock, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function CashierDashboard() {
  const [data, setData] = useState({
    todayTransactions: 0,
    todaySales: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/dashboard/cashier');
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
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cashier Dashboard</h1>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
            >
              <Home className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Website</span>
              <span className="sm:hidden">Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Today's Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{data.todayTransactions}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Sales</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900">Rp {data.todaySales.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </div>
        </div>



        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/kasir/booking')}
              className="flex items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white p-4 sm:p-6 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg font-semibold">Ticket Booking</span>
            </button>
            

            
            <button
              onClick={() => navigate('/kasir/history')}
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg font-semibold">Today's History</span>
            </button>
          </div>
        </div>

        {/* Performance Info */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 sm:p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center mr-3 sm:mr-4">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">Today's Performance</h4>
              <p className="text-sm sm:text-base text-gray-600">
                {data.todayTransactions > 0 
                  ? `Average per transaction: Rp ${Math.round(data.todaySales / data.todayTransactions).toLocaleString('id-ID')}`
                  : 'No transactions today'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}