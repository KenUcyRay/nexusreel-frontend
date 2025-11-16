import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, DollarSign } from 'lucide-react';
import api from '../../utils/api';

export default function CashierHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayTransactions();
  }, []);

  const fetchTodayTransactions = async () => {
    try {
      const response = await api.get('/api/cashier/today-transactions');
      const data = response.data?.data || [];
      
      const formattedTransactions = data
        .map(transaction => ({
          id: transaction.transaction_id,
          customer_name: transaction.customer_name,
          movie_title: transaction.movie?.name || 'Unknown Movie',
          studio_name: transaction.schedule?.studio_name || 'Unknown Studio',
          seats: transaction.seats || [],
          amount: transaction.total_price,
          payment_method: transaction.payment_method,
          status: transaction.payment_status,
          order_id: transaction.order_id || `CASH-${transaction.transaction_id}`,
          created_at: transaction.created_at
        }));
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Failed to fetch cash transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading today's transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Today's Transactions</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Ticket className="w-10 h-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <DollarSign className="w-10 h-10 text-green-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {transactions.reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                        <Ticket className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">
                            {transaction.movie_title || 'Movie Ticket'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status === 'success' ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {new Date(transaction.created_at).toLocaleTimeString('id-ID')}
                          </div>
                          {transaction.studio_name && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {transaction.studio_name}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Customer:</span> {transaction.customer_name || 'N/A'}
                        </div>
                        
                        {transaction.seats && transaction.seats.length > 0 && (
                          <div className="mt-1 text-sm text-gray-600">
                            <span className="font-medium">Seats:</span> {
                              Array.isArray(transaction.seats) 
                                ? transaction.seats.join(', ')
                                : JSON.stringify(transaction.seats)
                            }
                          </div>
                        )}
                        
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">Order ID:</span> 
                          <span className="font-mono ml-1">{transaction.order_id}</span>
                        </div>
                        
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Payment Method:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.payment_method === 'cash' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.payment_method === 'cash' ? '💵 Cash Payment' : '💳 Digital Payment'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        Rp {(transaction.amount || 0).toLocaleString('id-ID')}
                      </div>
                      <div className={`text-sm font-medium ${
                        transaction.payment_method === 'cash' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {transaction.payment_method === 'cash' ? '💵 Cash' : '💳 Digital'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Today</h3>
                <p className="text-gray-500">No transactions have been made today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}