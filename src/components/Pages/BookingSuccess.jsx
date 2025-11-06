import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Ticket, ShoppingCart } from 'lucide-react';
import Navbar from "../ui/MainNavbar";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  let bookingData = location.state;
  
  // Check if user is cashier
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCashier = user.role === 'kasir';

  // Handle Midtrans redirect with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('order_id');
    const statusCode = urlParams.get('status_code');
    const transactionStatus = urlParams.get('transaction_status');
    
    if (orderId && statusCode && transactionStatus) {
      // Find transaction by order_id in localStorage
      const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
      const transaction = transactions.find(t => t.order_id === orderId);
      
      if (transaction) {
        // Update transaction status
        transaction.payment_status = transactionStatus === 'settlement' ? 'success' : transactionStatus;
        localStorage.setItem('userTransactions', JSON.stringify(transactions));
        
        // Clear URL parameters and reload without them
        window.history.replaceState({}, document.title, '/booking-success');
      }
    }
  }, [location.search]);

  // If no state, get latest transaction from localStorage
  if (!bookingData) {
    const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
    if (transactions.length > 0) {
      bookingData = transactions[transactions.length - 1]; // Get latest transaction
    }
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isCashier && <Navbar />}
        <div className={`${isCashier ? 'pt-8' : 'pt-32'} flex justify-center items-center h-64`}>
          <div className="text-center">
            <p className="text-gray-500 mb-4">No booking data found</p>
            <button 
              onClick={() => navigate(isCashier ? '/kasir/dashboard' : '/movies')}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg"
            >
              {isCashier ? 'Back to Dashboard' : 'Back to Movies'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isCashier && <Navbar />}
      
      <div className={`${isCashier ? 'pt-8' : 'pt-32'} pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              {bookingData.type === 'food' ? 'Your food order has been placed successfully' : 'Your movie tickets have been booked successfully'}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {bookingData.type === 'food' ? 'Order Details' : 'Booking Details'}
            </h2>
            
            {bookingData.type === 'food' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Food Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Items</h3>
                  <div className="space-y-3">
                    {bookingData.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-semibold">{new Date(bookingData.payment_date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <div className="flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-semibold">{bookingData.items?.reduce((total, item) => total + item.quantity, 0)} item(s)</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-[#FFA500]">
                        Rp {parseInt(bookingData.totalPrice).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Movie Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Movie Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Movie</p>
                      <p className="font-semibold">{bookingData.schedule?.movie?.title || bookingData.schedule?.movie?.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <p className="font-semibold">{new Date(bookingData.schedule?.show_date).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          <p className="font-semibold">{bookingData.schedule?.show_time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Studio</p>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-semibold">{bookingData.schedule?.studio?.name || 'Studio'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Seats</p>
                      <div className="flex items-center">
                        <Ticket className="w-4 h-4 mr-1 text-gray-400" />
                        <p className="font-semibold">{bookingData.selectedSeats?.join(', ')}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Number of Tickets</p>
                      <p className="font-semibold">{bookingData.ticketCount} ticket(s)</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-[#FFA500]">
                        Rp {parseInt(bookingData.totalPrice).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Info */}
          {bookingData.order_id && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{bookingData.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {bookingData.type === 'food' ? (
              <>
                <button
                  onClick={() => navigate(isCashier ? '/kasir/dashboard' : '/food')}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {isCashier ? 'Back to Dashboard' : 'Buy Another Product'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Print Receipt
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(isCashier ? '/kasir/dashboard' : '/movies')}
                  className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {isCashier ? 'Back to Dashboard' : 'Book Another Movie'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Print Ticket
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}