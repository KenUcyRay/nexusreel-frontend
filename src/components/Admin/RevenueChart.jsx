import React, { useState, useEffect } from 'react';

const RevenueChart = ({ data = [] }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            setChartData(data);
        } else {
            // Get real data from localStorage
            const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
            const monthlyRevenue = {};
            
            // Process transactions
            transactions.forEach(transaction => {
                if (transaction.payment_status === 'success') {
                    const date = new Date(transaction.payment_date || transaction.schedule?.show_date);
                    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    
                    if (!monthlyRevenue[monthKey]) {
                        monthlyRevenue[monthKey] = 0;
                    }
                    monthlyRevenue[monthKey] += parseInt(transaction.totalPrice || 0);
                }
            });
            
            // Convert to chart format
            const chartArray = Object.entries(monthlyRevenue)
                .map(([month, revenue]) => ({ month, revenue }))
                .sort((a, b) => new Date(a.month) - new Date(b.month))
                .slice(-6); // Last 6 months
            
            // If no real data, use sample data
            if (chartArray.length === 0) {
                setChartData([
                    { month: 'Jan', revenue: 15000000 },
                    { month: 'Feb', revenue: 18000000 },
                    { month: 'Mar', revenue: 22000000 },
                    { month: 'Apr', revenue: 19000000 },
                    { month: 'May', revenue: 25000000 },
                    { month: 'Jun', revenue: 28000000 }
                ]);
            } else {
                setChartData(chartArray);
            }
        }
    }, [data]);

    const maxRevenue = Math.max(...chartData.map(item => item.revenue));
    
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Chart</h3>
            <div className="space-y-4">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-12 text-sm text-gray-600">{item.month}</div>
                        <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="w-24 text-sm text-gray-900 font-medium text-right">
                            Rp {(item.revenue / 1000000).toFixed(1)}M
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
                Revenue in millions (Rp)
            </div>
        </div>
    );
};

export default RevenueChart;