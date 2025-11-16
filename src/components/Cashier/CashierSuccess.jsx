import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, User, Phone, CreditCard } from 'lucide-react';

export default function CashierSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, paymentMethod, type } = location.state || {};
  const isFood = type === 'food';

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking data found</p>
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isFood ? 'Food Order Successful!' : 'Booking Successful!'}
          </h1>
          <p className="text-gray-600">
            {paymentMethod === 'cash' ? 'Cash payment completed' : 'Digital payment processed'}
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isFood ? 'Order Details' : 'Booking Details'}
          </h2>
          
          <div className="space-y-4">
            {!isFood && (
              <>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Movie & Schedule</p>
                    <p className="font-semibold">{booking.movie_name || 'Movie'}</p>
                    <p className="text-sm text-gray-500">
                      {booking.show_date} at {booking.show_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Studio</p>
                    <p className="font-semibold">{booking.studio_name || 'Studio'}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold">{booking.customer_name}</p>
              </div>
            </div>

            {!isFood && booking.seats && (
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{booking.seats.join(', ')}</p>
                </div>
              </div>
            )}
            
            {isFood && booking.items && (
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Items</p>
                  <div className="space-y-1">
                    {booking.items.map((item, index) => (
                      <p key={index} className="font-semibold text-sm">
                        {item.quantity}x {item.name} - Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold capitalize">
                  {paymentMethod === 'cash' ? 'Cash Payment' : 'Digital Payment'}
                </p>
              </div>
            </div>
            
            {booking.order_id && (
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold font-mono text-sm">{booking.order_id}</p>
                </div>
              </div>
            )}
          </div>

          {booking.total_amount && (
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-[#FFA500]">
                  Rp {parseInt(booking.total_amount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            🎫 Print Ticket
          </button>
          <button
            onClick={() => navigate(isFood ? '/kasir/food' : '/kasir/booking')}
            className="bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            {isFood ? 'New Food Order' : 'New Booking'}
          </button>
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}