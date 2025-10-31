import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import Navbar from "../ui/MainNavbar";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No booking data found</p>
            <button 
              onClick={() => navigate('/movies')}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg"
            >
              Back to Movies
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Successful!</h1>
            <p className="text-gray-600 mb-8">Your movie tickets have been booked successfully.</p>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Ticket className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Movie</p>
                    <p className="font-semibold">{bookingData.schedule?.movie?.title}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{new Date(bookingData.schedule?.show_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">{bookingData.schedule?.show_time}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Studio</p>
                    <p className="font-semibold">{bookingData.schedule?.studio?.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Ticket className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Seats</p>
                    <p className="font-semibold">{bookingData.selectedSeats?.join(', ')}</p>
                  </div>
                </div>

                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Paid</span>
                    <span className="text-xl font-bold text-[#FFA500]">
                      Rp {bookingData.totalPrice?.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/movies')}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Book Another Movie
              </button>
              <button
                onClick={() => navigate('/history')}
                className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                View Booking History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}