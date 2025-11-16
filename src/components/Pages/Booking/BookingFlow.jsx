/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, CreditCard } from 'lucide-react';
import { useAuthContext } from '../../../contexts/AuthContext';
import Navbar from "../../ui/MainNavbar";
import api from '../../../utils/api';

export default function BookingFlow({ isCashier = false, onSuccess, onCancel }) {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: ticket selection, 2: seat selection, 3: payment
  const [schedule, setSchedule] = useState(null);
  const [studio, setStudio] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuthContext();

  useEffect(() => {
    fetchScheduleDetails();
  }, [scheduleId]);

  const fetchScheduleDetails = async () => {
    try {
      // Use schedules list endpoint and filter by ID
      const response = await api.get('/api/schedules');
      console.log('Schedules API response:', response.data);
      const schedules = response.data.data || [];
      const scheduleData = schedules.find(s => s.id === parseInt(scheduleId));
      
      if (!scheduleData) {
        console.error('Schedule not found with ID:', scheduleId);
        navigate('/movies');
        return;
      }
      
      console.log('Schedule data:', scheduleData);
      setSchedule(scheduleData);
      setStudio(scheduleData.studio);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      navigate('/movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const generateSeats = () => {
    const seats = [];
    const studioRows = studio?.rows || 5;
    const studioCols = studio?.columns || 20;
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    console.log('Generating seats - Rows:', studioRows, 'Columns:', studioCols);
    
    for (let r = 0; r < studioRows; r++) {
      for (let c = 1; c <= studioCols; c++) {
        const seatNumber = `${rowLabels[r]}${c}`;
        seats.push(seatNumber);
      }
    }
    
    return seats;
  };

  const getTotalPrice = () => {
    const seatCount = step >= 2 ? selectedSeats.length : ticketCount;
    return seatCount * (schedule?.price || 0);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === ticketCount) {
      if (isCashier) {
        setStep(3);
      } else {
        const bookingData = {
          schedule,
          selectedSeats,
          totalPrice: getTotalPrice(),
          ticketCount
        };
        
        navigate('/payment', {
          state: bookingData
        });
      }
    }
  };

  const handleCashierPayment = async () => {
    if (!customerName || selectedSeats.length === 0) {
      alert('Please enter customer name and select seats');
      return;
    }

    setProcessing(true);
    
    try {
      const bookingData = {
        schedule_id: parseInt(scheduleId),
        seats: selectedSeats,
        customer_name: customerName,
        customer_email: 'cashier@nexuscinema.com',
        customer_phone: '08123456789',
        payment_method: paymentMethod,
        amount: getTotalPrice(),
        ticket_count: selectedSeats.length
      };

      if (paymentMethod === 'cash') {
        // Cash payment - langsung save ke database dengan status success
        try {
          bookingData.payment_status = 'success';
          const response = await api.post('/api/cashier/bookings', bookingData);
          
          const successData = response.data.data || response.data;
          const successBooking = {
            ...successData,
            customer_name: customerName,
            seats: selectedSeats,
            total_amount: getTotalPrice(),
            movie_name: schedule?.movie?.title || schedule?.movie?.name,
            studio_name: studio?.name || schedule?.studio?.name,
            show_date: schedule?.show_date,
            show_time: schedule?.show_time
          };
          
          if (onSuccess) {
            onSuccess(successBooking);
          } else {
            navigate('/kasir/success', { 
              state: { 
                booking: successBooking,
                paymentMethod: 'cash'
              }
            });
          }
          return;
        } catch (apiError) {
          console.error('Cash payment API error:', apiError);
          alert('Failed to save cash payment. Please try again.');
          return;
        }
      } else {
        // Digital payment - sama seperti booking flow user dengan Midtrans
        try {
          const midtransData = {
            amount: getTotalPrice(),
            customer_name: customerName,
            seats: selectedSeats,
            ticket_count: selectedSeats.length,
            schedule_id: parseInt(scheduleId)
          };
          const response = await api.post('/api/kasir/payment', midtransData);
          
          if (response.data.snap_token && window.snap) {
            window.snap.pay(response.data.snap_token, {
              onSuccess: async function(result) {
                console.log('Payment success:', result);
                
                try {
                  // Manual callback to update status
                  const callbackData = {
                    order_id: result.order_id,
                    transaction_status: 'settlement',
                    fraud_status: 'accept',
                    gross_amount: getTotalPrice().toString()
                  };
                  
                  await api.post('/api/manual/callback', callbackData);
                  console.log('Manual callback sent successfully');
                } catch (error) {
                  console.error('Manual callback failed:', error);
                }
                
                // Create success booking data
                const successBooking = {
                  id: result.order_id,
                  order_id: result.order_id,
                  customer_name: customerName,
                  seats: selectedSeats,
                  total_amount: getTotalPrice(),
                  movie_name: schedule?.movie?.title || schedule?.movie?.name,
                  studio_name: studio?.name || schedule?.studio?.name,
                  show_date: schedule?.show_date,
                  show_time: schedule?.show_time,
                  payment_method: 'midtrans',
                  status: 'success'
                };
                
                if (onSuccess) {
                  onSuccess(successBooking);
                } else {
                  navigate('/kasir/success', { 
                    state: { 
                      booking: successBooking,
                      paymentMethod: 'midtrans'
                    }
                  });
                }
              },
              onPending: function(result) {
                console.log('Payment pending:', result);
                alert('Payment is being processed. Please wait for confirmation.');
              },
              onError: function(result) {
                console.log('Payment error:', result);
                alert('Payment failed. Please try again.');
              },
              onClose: function() {
                console.log('Payment popup closed');
              }
            });
            return;
          } else {
            alert('Failed to initialize payment. Please try again.');
            return;
          }
        } catch (apiError) {
          console.error('Digital payment API error:', apiError);
          alert('Failed to initialize payment. Please try again.');
          return;
        }
      }
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isCashier && <Navbar />}
        <div className={`${isCashier ? 'pt-8' : 'pt-32'} flex justify-center items-center h-64`}>
          <div className="text-gray-500">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isCashier && <Navbar />}
        <div className={`${isCashier ? 'pt-8' : 'pt-32'} flex justify-center items-center h-64`}>
          <div className="text-center">
            <p className="text-gray-500 mb-4">Schedule not found</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* Booking Steps */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold ${step >= 1 ? 'bg-[#FFA500] text-white' : 'bg-gray-300'}`}>1</div>
              <div className="w-8 sm:w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold ${step >= 2 ? 'bg-[#FFA500] text-white' : 'bg-gray-300'}`}>2</div>
              <div className="w-8 sm:w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold ${step >= 3 ? 'bg-[#FFA500] text-white' : 'bg-gray-300'}`}>3</div>
            </div>
          </div>
          
          {/* Step Labels - Mobile */}
          <div className="flex justify-center mb-6 sm:hidden">
            <div className="flex items-center space-x-8 text-xs text-gray-600">
              <span className={step >= 1 ? 'text-[#FFA500] font-semibold' : ''}>Tickets</span>
              <span className={step >= 2 ? 'text-[#FFA500] font-semibold' : ''}>Seats</span>
              <span className={step >= 3 ? 'text-[#FFA500] font-semibold' : ''}>Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Select Tickets</h2>
                  
                  {/* Movie Info */}
                  <div className="border-b pb-4 sm:pb-6 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">{schedule?.movie?.title || schedule?.movie?.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm sm:text-base text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(schedule?.show_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {schedule?.show_time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {studio?.name}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Selection */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <select
                      value={ticketCount}
                      onChange={(e) => {
                        setTicketCount(parseInt(e.target.value));
                        setSelectedSeats([]);
                      }}
                      className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500] appearance-none bg-white"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base sm:text-sm touch-manipulation"
                  >
                    Select Seats
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Select Seats</h2>
                  
                  {/* Screen */}
                  <div className="text-center mb-4 sm:mb-8">
                    <div className="bg-gray-800 text-white py-2 px-4 sm:px-8 rounded-lg inline-block mb-2 text-sm sm:text-base">
                      SCREEN
                    </div>
                  </div>

                  {/* Seats Grid */}
                  <div className="overflow-x-auto mb-4 sm:mb-6">
                    <div className={`grid gap-1 min-w-max mx-auto`} style={{gridTemplateColumns: `repeat(${studio?.columns || 20}, minmax(0, 1fr))`}}>
                      {generateSeats().map((seat) => (
                        <button
                          key={seat}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-7 h-7 sm:w-6 sm:h-6 rounded text-xs font-semibold transition-colors touch-manipulation ${
                            selectedSeats.includes(seat)
                              ? 'bg-[#FFA500] text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 active:bg-gray-400'
                          }`}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded mr-1 sm:mr-2"></div>
                      Available
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-[#FFA500] rounded mr-1 sm:mr-2"></div>
                      Selected
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full sm:flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors touch-manipulation"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedToPayment}
                      disabled={selectedSeats.length !== ticketCount}
                      className="w-full sm:flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    >
                      {isCashier ? 'Customer Info' : 'Proceed to Payment'}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && isCashier && (
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Customer Information & Payment</h2>
                  
                  <div className="space-y-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] outline-none"
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-3 sm:p-3 border-2 rounded-lg text-center transition-colors touch-manipulation ${
                            paymentMethod === 'cash'
                              ? 'border-[#FFA500] bg-orange-50 text-orange-700'
                              : 'border-gray-300 hover:border-gray-400 active:border-gray-500'
                          }`}
                        >
                          <div className="font-medium text-sm sm:text-base">Cash Payment</div>
                          <div className="text-xs sm:text-sm text-gray-500">Pay at counter</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('midtrans')}
                          className={`p-3 sm:p-3 border-2 rounded-lg text-center transition-colors touch-manipulation ${
                            paymentMethod === 'midtrans'
                              ? 'border-[#FFA500] bg-orange-50 text-orange-700'
                              : 'border-gray-300 hover:border-gray-400 active:border-gray-500'
                          }`}
                        >
                          <div className="font-medium text-sm sm:text-base">Digital Payment</div>
                          <div className="text-xs sm:text-sm text-gray-500">Card/E-wallet</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors touch-manipulation mb-3"
                    >
                      Back
                    </button>
                    
                    {paymentMethod === 'cash' ? (
                      <button
                        onClick={handleCashierPayment}
                        disabled={processing || !customerName || selectedSeats.length === 0}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                      >
                        {processing ? 'Processing...' : 'Payment Success'}
                      </button>
                    ) : (
                      <button
                        onClick={handleCashierPayment}
                        disabled={processing || !customerName || selectedSeats.length === 0}
                        className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                      >
                        {processing ? 'Processing...' : 'Proceed to Payment'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-32">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Booking Summary</h3>
                
                {schedule && (
                  <>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Movie</p>
                        <p className="font-semibold text-sm sm:text-base">{schedule.movie?.title || schedule.movie?.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-0 sm:block sm:space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Date & Time</p>
                          <p className="font-semibold text-xs sm:text-base">
                            {new Date(schedule.show_date).toLocaleDateString()} - {schedule.show_time}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Studio</p>
                          <p className="font-semibold text-xs sm:text-base">{studio?.name || schedule?.studio?.name || 'Studio'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Tickets</p>
                        <p className="font-semibold text-sm sm:text-base">{ticketCount} ticket{ticketCount > 1 ? 's' : ''}</p>
                      </div>
                      {selectedSeats.length > 0 && (
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600">Seats</p>
                          <p className="font-semibold text-sm sm:text-base break-words">{selectedSeats.join(', ')}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 sm:pt-4">
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">Price per ticket</span>
                        <span className="font-semibold text-xs sm:text-sm">Rp {parseInt(schedule.price || 0).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <span className="text-xs sm:text-sm text-gray-600">Quantity</span>
                        <span className="font-semibold text-xs sm:text-sm">{step >= 2 ? selectedSeats.length : ticketCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                        <span>Total</span>
                        <span className="text-[#FFA500]">Rp {parseInt(getTotalPrice()).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}