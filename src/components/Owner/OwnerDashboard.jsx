import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, Download, Eye, Home, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import OwnerDiscountReports from './OwnerDiscountReports';
import api from '../../utils/api';

export default function OwnerDashboard() {
  const [data, setData] = useState({
    today: 0,
    thisMonth: 0,
    total: 0,
    totalPurchases: 0,
    todayPurchases: 0,
    monthlyPurchases: 0,
    chartData: []
  });
  const [chartType, setChartType] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [pdfFilter, setPdfFilter] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
  }, [chartType]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/api/dashboard/owner?type=${chartType}`);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Revenue Report</h1>
        <p>Period: ${pdfFilter === 'daily' ? selectedDate : 'Monthly'}</p>
        <p>Total Revenue: Rp ${data.total.toLocaleString('id-ID')}</p>
        <p>Generated on: ${new Date().toLocaleDateString('id-ID')}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
      <div className="max-w-6xl mx-auto">
        {/* Header with navigation buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Owner Dashboard</h1>
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
        
        {/* Revenue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Rp {data.today.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">Rp {data.thisMonth.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 border border-white/20">
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
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-xl p-4 sm:p-6 text-white border border-white/20">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm mb-1 opacity-90">Jumlah Pembelian</p>
                <p className="text-lg sm:text-2xl font-bold">{data.totalPurchases}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-4 sm:p-6 text-white border border-white/20">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm mb-1 opacity-90">Pembelian Hari Ini</p>
                <p className="text-lg sm:text-2xl font-bold">{data.todayPurchases}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-xl p-4 sm:p-6 text-white border border-white/20">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4" />
              <div>
                <p className="text-xs sm:text-sm mb-1 opacity-90">Pembelian Bulan Ini</p>
                <p className="text-lg sm:text-2xl font-bold">{data.monthlyPurchases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => setChartType('daily')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${chartType === 'daily' ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-lg' : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-white/40'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setChartType('monthly')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${chartType === 'monthly' ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-lg' : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-white/40'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setChartType('total')}
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${chartType === 'total' ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-lg' : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-white/40'}`}
            >
              Overall
            </button>
          </div>

          {/* Chart Visualization */}
          {(() => {
            const dataWithRevenue = data.chartData ? data.chartData.filter(item => (item.revenue || 0) > 0) : [];
            
            if (dataWithRevenue.length === 0) {
              return (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No data available</p>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 text-center">
                  {chartType === 'daily' ? 'Daily Chart' : chartType === 'monthly' ? 'Monthly Chart' : 'Overall Chart'}
                </h3>
                
                <div className="space-y-4">
                  {/* Bar Chart */}
                  <div className="flex items-end justify-center h-32 space-x-1 overflow-x-auto bg-white/70 p-2 rounded-lg border border-white/40">
                    {dataWithRevenue.map((item, index) => {
                      const maxRevenue = Math.max(...dataWithRevenue.map(d => d.revenue || 0));
                      const height = Math.max(((item.revenue || 0) / maxRevenue) * 80, 10);
                      
                      return (
                        <div key={index} className="flex flex-col items-center min-w-[50px]">
                          <div className="text-[10px] text-gray-600 mb-1">
                            {((item.revenue || 0) / 1000).toFixed(0)}k
                          </div>
                          <div 
                            className="bg-gradient-to-t from-[#FFD700] to-[#FFA500] rounded-t w-6 border border-orange-300"
                            style={{ height: `${height}px` }}
                            title={`${item.date}: Rp ${(item.revenue || 0).toLocaleString('id-ID')}`}
                          ></div>
                          <div className="text-[10px] text-gray-600 mt-1 text-center">
                            {item.date?.split(' ')[1] || item.date?.slice(-2) || 'N/A'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Smart Data Summary */}
                  {chartType === 'daily' && dataWithRevenue.length > 0 && (
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Days with Transactions:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dataWithRevenue.map((item, index) => (
                            <div key={index} className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-white/40">
                              <div className="text-xs text-gray-600">{item.date}</div>
                              <div className="text-sm font-semibold text-orange-600">Rp {item.revenue.toLocaleString('id-ID')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Discount Reports Section */}
        <OwnerDiscountReports />

        {/* PDF Controls */}
        <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Print PDF Report</h3>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
            <select
              value={pdfFilter}
              onChange={(e) => setPdfFilter(e.target.value)}
              className="border border-white/40 rounded-lg px-3 py-2 text-sm sm:text-base bg-white/70 backdrop-blur-sm"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
            
            {pdfFilter === 'daily' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-white/40 rounded-lg px-3 py-2 text-sm sm:text-base bg-white/70 backdrop-blur-sm"
              />
            )}
            
            <button
              onClick={() => setPdfPreview(true)}
              className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              Preview PDF
            </button>
            
            <button
              onClick={generatePDF}
              className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
            >
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              Print Report
            </button>
          </div>
        </div>

        {/* PDF Preview Modal */}
        {pdfPreview && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg sm:text-xl font-bold">PDF Report Preview</h2>
                  <button
                    onClick={() => setPdfPreview(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="border border-white/30 p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-lg">
                  <h3 className="text-base sm:text-lg font-bold mb-4">Revenue Report</h3>
                  <p className="mb-2 text-sm sm:text-base">Period: {pdfFilter === 'daily' ? selectedDate : 'Monthly'}</p>
                  <p className="mb-4 text-sm sm:text-base">Total Revenue: Rp {data.total.toLocaleString('id-ID')}</p>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <p>This report contains a revenue summary for the selected period.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={generatePDF}
                    className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 mr-1 sm:mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}