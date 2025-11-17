import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Percent, Calendar, Award } from 'lucide-react';
import api from '../../utils/api';

export default function DiscountReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  const COLORS = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/discount-reports', {
        params: dateRange
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rp ${parseInt(amount || 0).toLocaleString('id-ID')}`;
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  if (!reportData) {
    return <div className="text-center py-12">No data available</div>;
  }

  const { summary, popular_discounts, daily_usage } = reportData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Discount Analytics</h2>
              <p className="text-sm sm:text-base text-gray-600">Track discount performance and revenue impact</p>
            </div>
            <div className="flex gap-3">
              <input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Usage"
          value={summary.total_usage.toLocaleString()}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(summary.total_discount_amount)}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Revenue Impact"
          value={`${summary.discount_percentage.toFixed(1)}%`}
          icon={Percent}
          color="orange"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary.total_revenue)}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Popular Discounts */}
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Most Popular Discounts
          </h3>
          <div className="space-y-4">
            {popular_discounts.slice(0, 5).map((discount, index) => (
              <div key={discount.discount_id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm`} 
                       style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{discount.discount?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{discount.usage_count} uses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(discount.total_saved)}</p>
                  <p className="text-sm text-gray-600">saved</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Distribution */}
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={popular_discounts.slice(0, 6)}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="usage_count"
                nameKey="discount.name"
              >
                {popular_discounts.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Daily Discount Usage
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={daily_usage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'transactions' ? value : formatCurrency(value),
                name === 'transactions' ? 'Transactions' : 'Total Discount'
              ]}
            />
            <Bar dataKey="transactions" fill="#FFD700" name="transactions" />
            <Bar dataKey="total_discount" fill="#FFA500" name="total_discount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Impact Analysis */}
      <div className="mt-8 bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-1">Revenue with Discounts</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(summary.revenue_with_discount)}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-1">Original Revenue (without discounts)</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.revenue_without_discount)}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-1">Total Discount Given</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(summary.total_discount_amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}