import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, CreditCard } from 'lucide-react';
import Navbar from "../../ui/MainNavbar";
import api from '../../../utils/api';

export default function BookingFlow() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: ticket selection, 2: seat selection, 3: payment
  const [schedule, setSchedule] = useState(null);
  const [studio, setStudio] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user is cashier
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCashier = user.role === 'kasir';

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
      const bookingData = {
        schedule,
        selectedSeats,
        totalPrice: getTotalPrice(),
        ticketCount
      };
      
      console.log('Sending booking data to Payment:', bookingData);
      console.log('Schedule ID:', schedule?.id);
      console.log('Schedule object:', schedule);
      
      // Navigate to payment with booking data
      navigate('/payment', {
        state: bookingData
      });
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
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#FFA500] text-white' : 'bg-gray-300'}`}>1</div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#FFA500] text-white' : 'bg-gray-300'}`}>2</div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-[#FFA500] text-white' : 'bg-gray-300'}`}>3</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Tickets</h2>
                  
                  {/* Movie Info */}
                  <div className="border-b pb-6 mb-6">
                    <h3 className="text-lg font-semibold mb-2">{schedule?.movie?.title || schedule?.movie?.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-600">
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
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <select
                      value={ticketCount}
                      onChange={(e) => {
                        setTicketCount(parseInt(e.target.value));
                        setSelectedSeats([]);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA500] focus:border-[#FFA500]"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Select Seats
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Seats</h2>
                  
                  {/* Screen */}
                  <div className="text-center mb-8">
                    <div className="bg-gray-800 text-white py-2 px-8 rounded-lg inline-block mb-2">
                      SCREEN
                    </div>
                  </div>

                  {/* Seats Grid */}
                  <div className={`grid gap-1 mb-6 max-w-4xl mx-auto`} style={{gridTemplateColumns: `repeat(${studio?.columns || 20}, minmax(0, 1fr))`}}>
                    {generateSeats().map((seat) => (
                      <button
                        key={seat}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                          selectedSeats.includes(seat)
                            ? 'bg-[#FFA500] text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center space-x-6 mb-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                      Available
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-[#FFA500] rounded mr-2"></div>
                      Selected
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProceedToPayment}
                      disabled={selectedSeats.length !== ticketCount}
                      className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
                
                {schedule && (
                  <>
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Movie</p>
                        <p className="font-semibold">{schedule.movie?.title || schedule.movie?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-semibold">
                          {new Date(schedule.show_date).toLocaleDateString()} - {schedule.show_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Studio</p>
                        <p className="font-semibold">{studio?.name || schedule?.studio?.name || 'Studio'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tickets</p>
                        <p className="font-semibold">{ticketCount} ticket{ticketCount > 1 ? 's' : ''}</p>
                      </div>
                      {selectedSeats.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Seats</p>
                          <p className="font-semibold">{selectedSeats.join(', ')}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Price per ticket</span>
                        <span className="font-semibold">Rp {parseInt(schedule.price || 0).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-semibold">{step >= 2 ? selectedSeats.length : ticketCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold">
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