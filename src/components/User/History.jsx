import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, Eye, ShoppingCart } from 'lucide-react';
import Navbar from '../ui/MainNavbar';
import { useAuthContext } from '../../contexts/AuthContext';

export default function History() {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'movie', 'food'

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Get transactions from localStorage
      const storedTransactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
      
      // Filter transactions by current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userTransactions = storedTransactions.filter(transaction => 
        transaction.customerEmail === currentUser.email || 
        transaction.customer_email === currentUser.email ||
        (currentUser.role === 'kasir' && transaction.customerEmail?.includes('kasir@nexuscinema.com'))
      );
      
      // Generate ticket IDs for existing transactions
      const transactionsWithTicketId = userTransactions.map((transaction, index) => {
        if (transaction.type === 'food') {
          return {
            ...transaction,
            id: index + 1,
            orderId: transaction.order_id || `FOOD-${Date.now()}-${index + 1}`,
            type: 'food',
            items: transaction.items || [],
            totalPrice: transaction.totalPrice || 0,
            status: transaction.payment_status === 'success' ? 'completed' : 'pending',
            date: transaction.payment_date || new Date().toISOString()
          };
        } else {
          return {
            ...transaction,
            id: index + 1,
            ticketId: transaction.order_id || `TIX-${Date.now()}-${index + 1}`,
            type: 'movie',
            movie: transaction.schedule?.movie?.title || transaction.schedule?.movie?.name || 'Unknown Movie',
            date: transaction.schedule?.show_date || new Date().toISOString(),
            time: transaction.schedule?.show_time || '00:00',
            studio: transaction.schedule?.studio?.name || 'Unknown Studio',
            seats: transaction.selectedSeats || [],
            totalPrice: transaction.totalPrice || 0,
            status: transaction.payment_status === 'success' ? 'completed' : 'pending'
          };
        }
      });
      
      setTransactions(transactionsWithTicketId);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

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
          
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('movie')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'movie'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tickets
            </button>
            <button
              onClick={() => setActiveFilter('food')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'food'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Food
            </button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-500">You haven't made any bookings yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {transactions
                .filter(transaction => {
                  if (activeFilter === 'all') return true;
                  if (activeFilter === 'movie') return transaction.type !== 'food';
                  if (activeFilter === 'food') return transaction.type === 'food';
                  return true;
                })
                .map((transaction) => (
                <div key={transaction.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      {transaction.type === 'food' ? (
                        <>
                          <div className="flex items-center mb-2">
                            <ShoppingCart className="w-5 h-5 text-[#FFA500] mr-2" />
                            <h3 className="text-xl font-bold text-gray-900">Food Order</h3>
                          </div>
                          
                          <div className="mb-2">
                            <span className="text-sm text-gray-600">Items: </span>
                            <span className="font-semibold">
                              {transaction.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                          </div>
                          
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Order ID: </span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{transaction.orderId}</span>
                          </div>
                        </>
                      ) : (
                        <>
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
                            <span className="font-semibold">{transaction.seats.join(', ')}</span>
                          </div>
                          
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Ticket ID: </span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{transaction.ticketId}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        Rp {parseInt(transaction.totalPrice).toLocaleString('id-ID')}
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

      {/* Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedTransaction.type === 'food' ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Food Order Details</h3>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Items Ordered</h4>
                      <div className="space-y-2">
                        {selectedTransaction.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700">{item.name} x{item.quantity}</span>
                            <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Order Date</h4>
                      <p className="text-gray-700">{new Date(selectedTransaction.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Order ID</h4>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedTransaction.orderId}</p>
                    </div>
                  </>
                ) : (
                  <>
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
                      <p className="text-gray-700">{selectedTransaction.seats.join(', ')}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Ticket ID</h4>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedTransaction.ticketId}</p>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-[#FFA500]">
                      Rp {parseInt(selectedTransaction.totalPrice).toLocaleString('id-ID')}
                    </span>
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