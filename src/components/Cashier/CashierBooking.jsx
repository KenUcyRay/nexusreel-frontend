import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

export default function CashierBooking() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/api/schedules');
      setSchedules(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSelect = (scheduleId) => {
    navigate(`/kasir/booking/${scheduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/kasir/dashboard')}
            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Select Movie Schedule</h1>
        </div>

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleScheduleSelect(schedule.id)}
            >
              <img
                src={schedule.movie?.image_url || getImageUrl(schedule.movie?.image) || getPlaceholderImage()}
                alt={schedule.movie?.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = getPlaceholderImage();
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{schedule.movie?.name}</h3>
                <p className="text-gray-600 mb-4">{schedule.movie?.genre}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(schedule.show_date).toLocaleDateString('id-ID')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {schedule.show_time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {schedule.studio?.name}
                  </div>

                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-2xl font-bold text-[#FFA500]">
                    Rp {schedule.price?.toLocaleString('id-ID') || '0'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No schedules available</p>
          </div>
        )}
      </div>
    </div>
  );
}