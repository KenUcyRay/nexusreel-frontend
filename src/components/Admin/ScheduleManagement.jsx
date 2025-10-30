import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import ScheduleForm from './ScheduleForm';
import Toast from '../ui/Toast';
import api from '../../utils/api';
import { useToast } from '../../hooks/useToast';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [movies, setMovies] = useState([]);
  const [studios, setStudios] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadSchedules();
    loadMovies();
    loadStudios();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/schedules');
      setSchedules(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async () => {
    try {
      const response = await api.get('/api/admin/movies');
      setMovies(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load movies:', error);
      setMovies([]);
    }
  };

  const loadStudios = async () => {
    try {
      const response = await api.get('/api/studios');
      setStudios(response.data.data || []);
    } catch (error) {
      // Studios endpoint not available - set empty array
      setStudios([]);
    }
  };

  const handleCreate = () => {
    setSelectedSchedule(null);
    setShowForm(true);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await api.delete(`/api/admin/schedules/${id}`);
        showToast('Schedule deleted successfully', 'success');
        loadSchedules();
      } catch (error) {
        console.error('Failed to delete schedule:', error);
        showToast('Failed to delete schedule', 'error');
      }
    }
  };

  const handleSave = async (scheduleData) => {
    try {
      if (selectedSchedule) {
        await api.put(`/api/admin/schedules/${selectedSchedule.id}`, scheduleData);
        showToast('Schedule updated successfully', 'success');
      } else {
        await api.post('/api/admin/schedules', scheduleData);
        showToast('Schedule created successfully', 'success');
      }
      setShowForm(false);
      setSelectedSchedule(null);
      loadSchedules();
    } catch (error) {
      console.error('Failed to save schedule:', error);
      throw error;
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
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Management</h2>
              <p className="text-gray-600">Manage movie showtimes and schedules</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-3 rounded-lg hover:from-orange-400 hover:to-orange-500 flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Movie
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Studio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : schedules.length > 0 ? (
                schedules.map((schedule, index) => (
                  <tr key={schedule.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <img
                            className="h-16 w-24 object-cover rounded-lg shadow-md border border-gray-200"
                            src={schedule.movie?.image ? `http://localhost:8000/storage/${schedule.movie.image}` : '/placeholder-movie.jpg'}
                            alt={schedule.movie?.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {schedule.movie?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {schedule.movie?.genre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{schedule.studio?.name}</div>
                      <div className="text-xs text-gray-500">{schedule.studio?.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(schedule.show_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {formatTime(schedule.show_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        Rp {schedule.price?.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit Schedule"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
                    <p className="text-gray-500">Create your first movie schedule!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <ScheduleForm
          schedule={selectedSchedule}
          movies={movies}
          studios={studios}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedSchedule(null);
          }}
          showToast={showToast}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default ScheduleManagement;