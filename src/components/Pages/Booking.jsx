import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCashier = user.role === 'kasir';

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
      <div className="min-h-screen bg-gray-50">
        {!isCashier && <Navbar />}
        <div className={`${isCashier ? 'pt-8' : 'pt-40'} flex justify-center items-center h-64`}>
          <div className="text-gray-500">Loading schedules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isCashier && <Navbar />}
      
      <div className={`${isCashier ? 'pt-8' : 'pt-40'} pb-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Movie Schedules</h1>
          
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No schedules available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <img 
                        src={schedule.movie?.image ? `http://localhost:8000/storage/${schedule.movie.image}` : '/placeholder-movie.jpg'} 
                        alt={schedule.movie?.title || 'Movie'} 
                        className="w-20 h-28 object-cover rounded-lg" 
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{schedule.movie?.title || 'Unknown Movie'}</h3>
                        <p className="text-gray-600 mb-2">{schedule.movie?.genre || 'N/A'}</p>
                        <p className="text-gray-500 text-sm mb-2">{formatDuration(schedule.movie?.duration || 0)}</p>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(schedule.show_date)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(schedule.show_time)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {schedule.studio?.name || 'Studio N/A'} - {schedule.studio?.type || 'Regular'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        Rp {parseInt(schedule.price || 0).toLocaleString('id-ID')}
                      </div>
                      <button
                        onClick={() => handleScheduleSelect(schedule)}
                        className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Book Now
                      </button>
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