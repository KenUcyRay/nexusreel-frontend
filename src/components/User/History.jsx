import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Clock, MapPin, Ticket, Eye } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import Navbar from '../ui/MainNavbar';
import api from '../../utils/api';

export default function History() {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(t => 
      activeFilter === 'all' || 
      (activeFilter === 'movie' && t.type === 'movie')
    );
  }, [transactions, activeFilter]);

  const fetchTransactions = useCallback(async () => {
    if (!user || !user.email) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get('/api/transactions');
      
      // Backend sudah secure dengan data isolation
      if (!response.data || !response.data.success) {
        setTransactions([]);
        setLoading(false);
        return;
      }
      
      const apiTransactions = response.data.data || [];
      
      // Backend sudah filter dengan aman, langsung gunakan data
      const userTransactions = apiTransactions;
      
      const processedTransactions = userTransactions.map((transaction, index) => {
        
        // Movie transaction only
        return {
          ...transaction,
          id: transaction.id || index + 1,
          ticketId: transaction.order_id || transaction.id,
          type: 'movie',
          movie: transaction.movie_title || 'Unknown Movie',
          poster: transaction.movie_poster,
          date: transaction.show_date || transaction.created_at?.split('T')[0],
          time: transaction.show_time || transaction.time || '00:00',
          studio: transaction.studio_name || 'Studio',
          seats: Array.isArray(transaction.seats) ? transaction.seats : 
                 typeof transaction.seats === 'string' ? JSON.parse(transaction.seats || '[]') : [],
          totalPrice: transaction.amount || 0,
          status: transaction.status === 'success' ? 'completed' : 'pending',
          ticketCount: transaction.ticket_count || 1
        };
      }).filter(Boolean);
      
      setTransactions(processedTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleViewDetails = useCallback((transaction) => {
    setSelectedTransaction(transaction);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedTransaction(null);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex justify-center items-center h-64">
          <div className="text-gray-500">Loading transaction history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction History</h1>
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
            {['all', 'movie'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter === 'all' ? 'All' : 'Tickets'}
              </button>
            ))}
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500">You haven't made any bookings yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      {/* Movie Poster */}
                      {transaction.poster && (
                        <img 
                          src={`http://localhost:8000/storage/${transaction.poster}`}
                          alt={transaction.movie}
                          className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Ticket className="w-5 h-5 text-[#FFA500] mr-2" />
                          <h3 className="text-xl font-bold text-gray-900">{transaction.movie}</h3>
                        </div>
                      
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {transaction.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {transaction.studio}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Seats: </span>
                          <span className="font-semibold">{transaction.seats?.join?.(', ') || 'No seats'}</span>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Tickets: </span>
                          <span className="font-semibold">{transaction.ticketCount} ticket(s)</span>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">Ticket ID: </span>
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{transaction.ticketId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        Rp {(parseInt(transaction.totalPrice) || 0).toLocaleString('id-ID')}
                      </div>
                      <div className="mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewDetails(transaction)}
                        className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Movie Information</h3>
                  <p className="text-gray-700">{selectedTransaction.movie}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Date</h4>
                    <p className="text-gray-700">{new Date(selectedTransaction.date).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Time</h4>
                    <p className="text-gray-700">{selectedTransaction.time}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Studio</h4>
                  <p className="text-gray-700">{selectedTransaction.studio}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Seats</h4>
                  <p className="text-gray-700">{selectedTransaction.seats?.join?.(', ') || 'No seats assigned'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Tickets</h4>
                  <p className="text-gray-700">{selectedTransaction.ticketCount} ticket(s)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ticket ID</h4>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedTransaction.ticketId}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-[#FFA500]">
                      Rp {(parseInt(selectedTransaction.totalPrice) || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTransaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedTransaction.status === 'completed' ? 'Completed' : 'Pending Payment'}
                    </span>
                    
                    {selectedTransaction.status === 'pending' && (
                      <button
                        onClick={() => {
                          try {
                            const url = `/payment?retry=${selectedTransaction.ticketId}`;
                            window.location.href = url;
                          } catch (error) {
                            console.error('Navigation error:', error);
                          }
                        }}
                        className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}