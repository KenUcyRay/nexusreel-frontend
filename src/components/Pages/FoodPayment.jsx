import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, Mail, ShoppingCart } from 'lucide-react';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';

export default function FoodPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const orderData = location.state;
  
  // Check if user is cashier
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCashier = user.role === 'kasir';

  useEffect(() => {
    if (!orderData) {
      navigate('/food');
    }
  }, [orderData, navigate]);

  const handleInputChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    if (!customerData.name.trim()) {
      alert('Please enter your full name');
      return;
    }
    
    if (!customerData.email.trim()) {
      alert('Please enter your email address');
      return;
    }

    if (!orderData?.items?.length) {
      alert('No items in order');
      navigate('/food');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        amount: orderData.totalPrice,
        customer_name: customerData.name,
        customer_email: customerData.email,
        items: orderData.items.map(item => ({
          food_id: item.id,
          quantity: item.quantity,
          price: parseInt(item.price)
        }))
      };

      const response = await api.post('/api/food-payment', paymentData);
      const snapToken = response.data.snap_token;
      
      if (snapToken) {
        window.snap.pay(snapToken, {
          skipOrderSummary: true,
          onSuccess: function(result) {
            console.log('Food payment success:', result);
            // Save transaction to localStorage for history
            const transaction = {
              ...orderData,
              ...result,
              order_id: response.data.order_id,
              payment_status: 'success',
              payment_date: new Date().toISOString(),
              type: 'food'
            };
            
            // Save to localStorage
            const existingTransactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
            existingTransactions.push(transaction);
            localStorage.setItem('userTransactions', JSON.stringify(existingTransactions));
            
            // Navigate to success page
            window.location.href = '/booking-success';
          },
          onPending: function(result) {
            console.log('Food payment pending:', result);
            alert('Payment is pending. Please complete your payment.');
          },
          onError: function(result) {
            console.log('Food payment error:', result);
            alert('Payment failed. Please try again.');
          },
          onClose: function() {
            console.log('Food payment popup closed');
            // Handle payment cancellation - stay on payment page
          }
        });
      } else {
        alert('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to process payment';
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isCashier && <Navbar />}
      
      <div className={`${isCashier ? 'pt-8' : 'pt-32'} pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-[#FFA500] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <ShoppingCart className="w-6 h-6 text-[#FFA500] mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#FFA500]">
                    Rp {orderData.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}