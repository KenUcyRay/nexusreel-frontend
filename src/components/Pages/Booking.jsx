/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';

const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  const seats = [];
  
  rows.forEach(row => {
    for (let i = 1; i <= 14; i++) {
      const seatId = `${row}${i}`;
      const isOccupied = Math.random() < 0.3; // 30% chance occupied
      seats.push({
        id: seatId,
        row,
        number: i,
        isOccupied,
        isSelected: false
      });
    }
  });
  
  return seats;
};

export default function Booking() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Check if user is cashier
  const { user } = useAuthContext();
  const isCashier = user?.role === 'kasir';

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/api/schedules');
      const scheduleData = response.data.data || [];
      setSchedules(scheduleData);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleScheduleSelect = (schedule) => {
    navigate(`/booking/${schedule.id}`);
  };

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat.isOccupied) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
        {!isCashier && <Navbar />}
        <div className={`${isCashier ? 'pt-8' : 'pt-40'} flex justify-center items-center h-64`}>
          <div className="text-gray-500">Loading schedules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#C6E7FF]">
      {!isCashier && <Navbar />}
      
      <div className={`${isCashier ? 'pt-4 sm:pt-8' : 'pt-48 sm:pt-56 lg:pt-64'} pb-8 sm:pb-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8 lg:mb-12">Movie Schedules</h1>
          
          {schedules.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-600 text-base sm:text-lg">No schedules available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-gradient-to-br from-white to-[#C6E7FF] rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-4 lg:mb-0">
                      <img 
                        src={schedule.movie?.image_url || '/placeholder-movie.jpg'} 
                        alt={schedule.movie?.name || 'Movie'} 
                        className="w-16 h-20 sm:w-20 sm:h-28 object-cover rounded-lg flex-shrink-0" 
                        onError={(e) => {
                          e.target.src = '/placeholder-movie.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{schedule.movie?.name || 'Unknown Movie'}</h3>
                          {schedule.movie?.status === 'coming_soon' && (
                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">{schedule.movie?.genre || 'N/A'}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-2">{formatDuration(schedule.movie?.duration || 0)}</p>
                        
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{formatDate(schedule.show_date)}</span>
                          </div>
                          
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span>{formatTime(schedule.show_time)}</span>
                          </div>
                          
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{schedule.studio?.name || 'Studio N/A'} - {schedule.studio?.type || 'Regular'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between lg:flex-col lg:items-end lg:text-right mt-3 lg:mt-0">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 lg:mb-4">
                        Rp {parseInt(schedule.price || 0).toLocaleString('id-ID')}
                      </div>
                      {schedule.movie?.status === 'coming_soon' ? (
                        <div className="text-center">
                          <div className="bg-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base cursor-not-allowed opacity-60 mb-2">
                            Coming Soon
                          </div>
                          <p className="text-xs text-gray-500">Not available for booking</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleScheduleSelect(schedule)}
                          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer text-sm sm:text-base touch-manipulation"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );


}