import React, { useState, useEffect } from 'react';
import { Ticket, DollarSign, Plus, Clock, Home, LogOut, QrCode } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Cashier Dashboard</h1>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Website
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Today's Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center">
              <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{data.todayTransactions}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 border border-white/20">
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
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/kasir/booking')}
              className="flex flex-col items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white p-6 rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">New Booking</span>
              <span className="text-xs opacity-90 mt-1">Create ticket booking</span>
            </button>
            
            <button
              onClick={() => navigate('/kasir/scan-qr')}
              className="flex flex-col items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white p-6 rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <QrCode className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">Scan QR</span>
              <span className="text-xs opacity-90 mt-1">Scan ticket QR code</span>
            </button>
            
            <button
              onClick={() => navigate('/kasir/history')}
              className="flex flex-col items-center justify-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white p-6 rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Clock className="w-8 h-8 mb-3" />
              <span className="text-lg font-bold">View History</span>
              <span className="text-xs opacity-90 mt-1">Today's transactions</span>
            </button>
          </div>
        </div>

        {/* Performance Info */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-white/70 to-[#C6E7FF]/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/30 shadow-lg">
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