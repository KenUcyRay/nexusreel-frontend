import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Percent, Users, Award, Calendar } from 'lucide-react';
import api from '../../utils/api';

export default function OwnerDiscountReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  const COLORS = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'];

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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  if (!reportData) {
    return <div className="text-center py-12">No data available</div>;
  }

  const { summary, popular_discounts } = reportData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Discount Performance</h3>
            <p className="text-gray-600">Track discount usage and revenue impact</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_usage.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total_discount_amount)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
              <p className="text-2xl font-bold text-gray-900">{summary.discount_percentage.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Percent className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total_revenue)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

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

      {/* Revenue Impact Analysis */}
      <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Impact Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-1">Revenue with Discounts</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(summary.revenue_with_discount)}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-1">Original Revenue</p>
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