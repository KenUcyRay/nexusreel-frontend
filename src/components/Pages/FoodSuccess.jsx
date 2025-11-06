import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import Navbar from "../ui/MainNavbar";

export default function FoodSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  let orderData = location.state;

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
        window.history.replaceState({}, document.title, '/food-success');
      }
    }
  }, [location.search]);

  // If no state, get latest food transaction from localStorage
  if (!orderData) {
    const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
    const foodTransactions = transactions.filter(t => t.type === 'food');
    if (foodTransactions.length > 0) {
      orderData = foodTransactions[foodTransactions.length - 1]; // Get latest food transaction
    }
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No order data found</p>
            <button 
              onClick={() => navigate('/food')}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg"
            >
              Back to Food Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
            <p className="text-gray-600">Your food order has been placed successfully</p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <ShoppingCart className="w-6 h-6 text-[#FFA500] mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              {orderData.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: Rp {item.price.toLocaleString('id-ID')} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-[#FFA500]">
                  Rp {orderData.totalPrice?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          {orderData.order_id && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{orderData.order_id}</p>
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
            <button
              onClick={() => navigate('/food')}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Order More Food
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}