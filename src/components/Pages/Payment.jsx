import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, Mail } from 'lucide-react';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const bookingData = location.state;

  useEffect(() => {
    console.log('Booking data received in Payment:', bookingData);
    if (!bookingData) {
      navigate('/movies');
    }
  }, [bookingData, navigate]);

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

    if (!bookingData?.schedule?.id || !bookingData?.totalPrice || !bookingData?.selectedSeats?.length) {
      alert('Invalid booking data. Please try again.');
      navigate('/movies');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        amount: bookingData.totalPrice,
        customer_name: customerData.name,
        customer_email: customerData.email,
        seats: bookingData.selectedSeats,
        ticket_count: bookingData.ticketCount,
        schedule_id: bookingData.schedule.id
      };

      const response = await api.post('/api/payment', paymentData);
      const snapToken = response.data.snap_token;
      
      if (snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function(result) {
            navigate('/booking-success', { state: { ...bookingData, ...result } });
          },
          onPending: function(result) {
            alert('Payment is pending. Please complete your payment.');
          },
          onError: function(result) {
            alert('Payment failed. Please try again.');
          },
          onClose: function() {
            alert('You closed the popup');
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

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-16">
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

            {/* Booking Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Movie</p>
                  <p className="font-semibold text-lg">{bookingData.schedule?.movie?.title || bookingData.schedule?.movie?.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(bookingData.schedule?.show_date).toLocaleDateString('id-ID')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">{bookingData.schedule?.show_time}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Studio</p>
                  <p className="font-semibold">{bookingData.schedule?.studio?.name || 'Studio'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{bookingData.selectedSeats?.join(', ')}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Tickets</p>
                  <p className="font-semibold">{bookingData.ticketCount} ticket(s)</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-[#FFA500]">
                    Rp {parseInt(bookingData.totalPrice).toLocaleString('id-ID')}
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