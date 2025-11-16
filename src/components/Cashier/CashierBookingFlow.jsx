import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import BookingFlow from '../Pages/Booking/BookingFlow';

export default function CashierBookingFlow() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    // Redirect non-cashier users
    if (user && user.role !== 'kasir') {
      navigate('/unauthorized');
    }
  }, [user, navigate]);

  // Custom success handler for cashier
  const handleBookingSuccess = (bookingData) => {
    navigate('/kasir/success', {
      state: {
        booking: bookingData,
        paymentMethod: bookingData.payment_method || 'cash'
      }
    });
  };

  // Custom cancel handler for cashier
  const handleBookingCancel = () => {
    navigate('/kasir/dashboard');
  };

  return (
    <BookingFlow 
      isCashier={true}
      onSuccess={handleBookingSuccess}
      onCancel={handleBookingCancel}
    />
  );
}