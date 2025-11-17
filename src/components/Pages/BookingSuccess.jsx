import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Ticket, ShoppingCart, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from "../ui/MainNavbar";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  // Remove this line as we'll use state instead
  
  // Check if user is cashier
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCashier = user.role === 'kasir';

  const [successData, setSuccessData] = useState(null);

  // Get booking data from sessionStorage
  useEffect(() => {
    console.log('🔍 BookingSuccess - checking for data');
    console.log('📦 Location state:', location.state);
    
    if (location.state) {
      console.log('✅ Using location state data');
      setSuccessData(location.state);
    } else {
      const sessionData = sessionStorage.getItem('bookingSuccess');
      console.log('📱 SessionStorage data:', sessionData);
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          console.log('✅ Using sessionStorage data:', parsed);
          setSuccessData(parsed);
          sessionStorage.removeItem('bookingSuccess');
        } catch (e) {
          console.error('❌ Failed to parse sessionStorage data:', e);
        }
      } else {
        console.log('❌ No booking data found');
      }
    }
  }, [location.state]);

  // Use successData consistently
  const bookingData = successData;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
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
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
      {!isCashier && <Navbar />}
      
      <div className={`${isCashier ? 'pt-8' : 'pt-32'} pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              {bookingData?.type === 'food' ? 'Your food order has been placed successfully' : 'Your movie tickets have been booked successfully'}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {bookingData?.type === 'food' ? 'Order Details' : 'Booking Details'}
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
                    
                    {bookingData.discount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">Discount Applied</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {bookingData.discount.type === 'percentage' ? `${bookingData.discount.amount}%` : `Rp ${parseInt(bookingData.discount.amount).toLocaleString('id-ID')}`}
                          </span>
                        </div>
                        <div className="text-xs text-green-700 mb-1">{bookingData.discount.name}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700">You Saved</span>
                          <span className="font-bold text-green-800">Rp {parseInt(bookingData.discount.discount_amount).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    )}
                    
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

          {/* Payment Info & QR Code */}
          {bookingData.order_id && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information & E-Ticket</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
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
                  <div>
                    <p className="text-sm text-gray-600 mb-2">E-Ticket QR Code</p>
                    <p className="text-xs text-gray-500">Show this QR code at the cinema entrance</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <QRCodeSVG 
                      value={JSON.stringify({
                        orderId: bookingData.order_id,
                        movie: bookingData.schedule?.movie?.name || bookingData.schedule?.movie?.title,
                        date: bookingData.schedule?.show_date,
                        time: bookingData.schedule?.show_time,
                        seats: bookingData.selectedSeats,
                        studio: bookingData.schedule?.studio?.name,
                        amount: bookingData.totalPrice
                      })}
                      size={150}
                      level="M"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const svg = document.querySelector('svg');
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const img = new Image();
                      img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        const url = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ticket-${bookingData.order_id}.png`;
                        a.click();
                      };
                      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                    }}
                    className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate(isCashier ? '/kasir/dashboard' : (bookingData.type === 'food' ? '/food' : '/movies'))}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {isCashier ? 'Back to Dashboard' : (bookingData.type === 'food' ? 'Buy Another Product' : 'Book Another Movie')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}