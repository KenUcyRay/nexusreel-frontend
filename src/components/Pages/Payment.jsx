import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, Mail } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // Check if user is cashier
  const { user } = useAuthContext();
  const isCashier = user?.role === 'kasir';
  
  const [customerData, setCustomerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const bookingData = location.state;

  useEffect(() => {
    console.log('Booking data received in Payment:', bookingData);
    if (!bookingData) {
      navigate('/movies');
    } else {
      checkDiscount();
    }
  }, [bookingData, navigate]);
  
  const checkDiscount = async () => {
    if (!bookingData?.schedule?.id || !bookingData?.totalPrice) return;
    
    const calculatedSubtotal = parseFloat(bookingData.totalPrice);
    setSubtotal(calculatedSubtotal);
    setFinalTotal(calculatedSubtotal);
    
    try {
      console.log('🔍 Checking discount with:', {
        schedule_id: bookingData.schedule.id,
        subtotal: calculatedSubtotal
      });
      
      const response = await api.post('/api/check-discount', {
        schedule_id: bookingData.schedule.id,
        subtotal: calculatedSubtotal
      });
      
      console.log('📋 Discount response:', response.data);
      
      if (response.data.success && response.data.discount) {
        console.log('✅ Discount applied:', response.data.discount);
        setDiscount(response.data.discount);
        setFinalTotal(response.data.discount.final_total);
      } else {
        console.log('❌ No discount found');
      }
    } catch (error) {
      console.error('Failed to check discount:', error);
    }
  };

  // Auto-populate user data when user is available
  useEffect(() => {
    if (user) {
      setCustomerData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    if (!customerData.name.trim()) {
      alert('Please enter customer name');
      return;
    }
    
    if (!isCashier && !customerData.email.trim()) {
      alert('Please enter your email address');
      return;
    }

    if (!bookingData?.schedule?.id || !bookingData?.totalPrice || !bookingData?.selectedSeats?.length) {
      alert('Invalid booking data. Please try again.');
      navigate(isCashier ? '/kasir/dashboard' : '/movies');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        amount: finalTotal,
        subtotal: subtotal,
        discount_id: discount?.id || null,
        discount_amount: discount?.discount_amount || 0,
        customer_name: customerData.name,
        customer_email: customerData.email || user?.email || 'customer@nexuscinema.com',
        seats: bookingData.selectedSeats,
        ticket_count: bookingData.ticketCount,
        schedule_id: bookingData.schedule.id
      };
      
      console.log('📧 CRITICAL - Customer email being sent:', paymentData.customer_email);
      console.log('📧 CRITICAL - User from context:', user?.email);
      console.log('📧 CRITICAL - Customer data email:', customerData.email);

      console.log('🚀 CRITICAL DEBUG - Payment data being sent:', paymentData);
      console.log('🚀 CRITICAL DEBUG - Schedule ID in payment:', paymentData.schedule_id);
      console.log('🚀 CRITICAL DEBUG - User info:', { user, isCashier });
      
      const endpoint = isCashier ? '/api/kasir/payment' : '/api/movie-payment';
      console.log('🚀 CRITICAL DEBUG - Using endpoint:', endpoint);
      
      const response = await api.post(endpoint, paymentData);
      const snapToken = response.data.snap_token;
      
      console.log('🚀 CRITICAL DEBUG - Backend response:', response.data);
      console.log('🚀 CRITICAL DEBUG - Snap token:', snapToken);
      console.log('🚀 CRITICAL DEBUG - Order ID generated:', response.data.order_id);
      
      if (snapToken) {
        window.snap.pay(snapToken, {
          skipOrderSummary: true,
          onSuccess: function(result) {
            console.log('Payment success:', result);
            
            // Store booking data temporarily for success page
            const successData = {
              ...bookingData,
              order_id: response.data.order_id,
              payment_status: 'completed',
              payment_date: new Date().toISOString(),
              type: 'movie',
              customer_email: customerData.email || user.email || 'customer@nexuscinema.com',
              discount: discount
            };
            console.log('💾 Storing success data to sessionStorage:', successData);
            sessionStorage.setItem('bookingSuccess', JSON.stringify(successData));
            console.log('✅ SessionStorage set successfully');
            
            // Update payment status to completed via callback
            const callbackData = {
              order_id: response.data.order_id,
              transaction_status: 'settlement',
              amount: bookingData.totalPrice,
              customer_name: customerData.name,
              customer_email: customerData.email || user?.email || 'customer@nexuscinema.com',
              schedule_id: bookingData.schedule.id,
              seats: bookingData.selectedSeats,
              ticket_count: bookingData.ticketCount,
              movie_name: bookingData.schedule?.movie?.title || bookingData.schedule?.movie?.name || 'Movie',
              show_date: bookingData.schedule?.show_date,
              show_time: bookingData.schedule?.show_time,
              studio_name: bookingData.schedule?.studio?.name || 'Studio'
            };
            
            console.log('📞 CRITICAL DEBUG - Callback data:', callbackData);
            console.log('📞 CRITICAL DEBUG - Schedule ID:', bookingData.schedule.id);
            console.log('📞 CRITICAL DEBUG - Order ID:', response.data.order_id);
            
            console.log('🔥 STARTING TRANSACTION SAVE PROCESS');
            console.log('🔥 Callback URL: /api/movie-payment/callback');
            console.log('🔥 Callback payload:', JSON.stringify(callbackData, null, 2));
            
            api.post('/api/movie-payment/callback', callbackData)
              .then((callbackResponse) => {
                console.log('🎉 TRANSACTION SAVE SUCCESS!');
                console.log('✅ CRITICAL DEBUG - Callback SUCCESS:', callbackResponse.data);
                console.log('✅ CRITICAL DEBUG - Transaction saved:', callbackResponse.data.transaction);
                console.log('✅ CRITICAL DEBUG - Transaction ID:', callbackResponse.data.transaction?.id);
                console.log('✅ CRITICAL DEBUG - Database confirmed:', callbackResponse.data.success);
                
                // Verify transaction was actually saved
                if (callbackResponse.data.transaction?.id) {
                  console.log('💾 TRANSACTION SUCCESSFULLY SAVED TO DATABASE!');
                  console.log('💾 Transaction ID:', callbackResponse.data.transaction.id);
                } else {
                  console.error('⚠️ WARNING: No transaction ID returned!');
                }
              })
              .catch(err => {
                console.error('💥 TRANSACTION SAVE FAILED!');
                console.error('❌ CRITICAL DEBUG - Callback FAILED:', err);
                console.error('❌ CRITICAL DEBUG - Error response:', err.response?.data);
                console.error('❌ CRITICAL DEBUG - Error status:', err.response?.status);
                console.error('❌ CRITICAL DEBUG - Error headers:', err.response?.headers);
                console.error('❌ CRITICAL DEBUG - Full error:', err.message);
                console.error('❌ CRITICAL DEBUG - Request config:', err.config);
                
                // Show detailed error to user
                const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
                alert(`CRITICAL: Transaction save failed!\n\nError: ${errorMsg}\nOrder ID: ${response.data.order_id}\n\nPlease screenshot this and contact support immediately!`);
              });
            
            // Navigate to success page after a delay to ensure callback completes
            console.log('🚀 Navigating to booking-success in 2 seconds...');
            setTimeout(() => {
              window.location.href = '/booking-success';
            }, 2000);
          },
          onPending: function(result) {
            console.log('Payment pending:', result);
            // Don't save pending transactions
            alert('Payment is pending. Please complete your payment.');
          },
          onError: function(result) {
            console.log('Payment error:', result);
            alert('Payment failed. Please try again.');
            // Don't save failed transactions to history
          },
          onClose: function() {
            console.log('Payment popup closed - transaction cancelled');
            // Don't save cancelled transactions to history
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
      {!isCashier && <Navbar />}
      
      <div className={`${isCashier ? 'pt-4 sm:pt-8' : 'pt-24 sm:pt-32'} pb-8 sm:pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
              <div className="flex items-center mb-4 sm:mb-6">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA500] mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      {isCashier ? 'Customer Name *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                      required
                    />
                  </div>

                  {!isCashier && (
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
                        className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                        required
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base sm:text-sm"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Booking Summary</h3>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Movie</p>
                  <p className="font-semibold text-base sm:text-lg break-words">{bookingData.schedule?.movie?.title || bookingData.schedule?.movie?.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-sm sm:text-base">{new Date(bookingData.schedule?.show_date).toLocaleDateString('id-ID')}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-sm sm:text-base">{bookingData.schedule?.show_time}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Studio</p>
                  <p className="font-semibold text-sm sm:text-base">{bookingData.schedule?.studio?.name || 'Studio'}</p>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Seats</p>
                  <p className="font-semibold text-sm sm:text-base break-words">{bookingData.selectedSeats?.join(', ')}</p>
                </div>
                
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Tickets</p>
                  <p className="font-semibold text-sm sm:text-base">{bookingData.ticketCount} ticket(s)</p>
                </div>
              </div>
              
              <div className="border-t pt-3 sm:pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="font-semibold">Rp {parseInt(subtotal).toLocaleString('id-ID')}</span>
                  </div>
                  
                  {discount ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 my-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm font-medium text-green-800">Discount Applied</span>
                          </div>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {discount.type === 'percentage' ? `${discount.amount}%` : `Rp ${parseInt(discount.amount).toLocaleString('id-ID')}`}
                          </span>
                        </div>
                        <div className="text-xs text-green-700 mb-1">{discount.name}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">Discount Amount</span>
                          <span className="font-bold text-green-800">-Rp {parseInt(discount.discount_amount).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">No discount applied</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center border-t pt-2 mt-3">
                    <span className="text-base sm:text-lg font-semibold">Total Amount</span>
                    <span className="text-lg sm:text-2xl font-bold text-[#FFA500]">
                      Rp {parseInt(finalTotal).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  {discount && (
                    <div className="text-center mt-2">
                      <span className="text-xs text-green-600 font-medium">
                        💰 You saved Rp {parseInt(discount.discount_amount).toLocaleString('id-ID')}!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}