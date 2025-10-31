import { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign } from 'lucide-react';

const ScheduleForm = ({ schedule, movies, studios, onSave, onCancel, showToast }) => {
  const [formData, setFormData] = useState({
    movie_id: '',
    studio_id: '',
    show_date: '',
    show_time: '',
    price: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (schedule) {
      setFormData({
        movie_id: schedule.movie_id || '',
        studio_id: schedule.studio_id || '',
        show_date: schedule.show_date || '',
        show_time: schedule.show_time || '',
        price: schedule.price || ''
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.movie_id) {
      newErrors.movie_id = 'Movie is required';
    }
    
    if (!formData.studio_id) {
      newErrors.studio_id = 'Studio is required';
    }
    
    if (!formData.show_date) {
      newErrors.show_date = 'Show date is required';
    }
    
    if (!formData.show_time) {
      newErrors.show_time = 'Show time is required';
    }
    
    if (!formData.price || formData.price < 1000) {
      newErrors.price = 'Price must be at least Rp 1,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await onSave({
        ...formData,
        price: parseInt(formData.price)
      });
    } catch (error) {
      console.error('Schedule save error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).flat();
        showToast(errorMessages.join(', '), 'error');
      } else {
        showToast(
          error.response?.data?.message || 'Failed to save schedule',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-grey" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {schedule ? 'Edit Schedule' : 'Add New Schedule'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-red-600 hover:text-gray-200 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 80px)' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Movie Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Movie *
              </label>
              <select
                name="movie_id"
                value={formData.movie_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select Movie</option>
                {Array.isArray(movies) ? movies.map(movie => (
                  <option key={movie.id} value={movie.id}>
                    {movie.name} ({movie.genre})
                  </option>
                )) : null}
              </select>
              {errors.movie_id && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                  {errors.movie_id}
                </p>
              )}
            </div>

            {/* Studio Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Studio *
              </label>
              <select
                name="studio_id"
                value={formData.studio_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select Studio</option>
                {Array.isArray(studios) ? studios.filter(studio => studio.status === 'active').map(studio => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name} ({studio.type}) - {studio.total_seats} seats
                  </option>
                )) : null}
              </select>
              {errors.studio_id && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                  {errors.studio_id}
                </p>
              )}
            </div>

            {/* Show Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Show Date *
              </label>
              <input
                type="date"
                name="show_date"
                value={formData.show_date}
                onChange={handleChange}
                min={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              {errors.show_date && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                  {errors.show_date}
                </p>
              )}
            </div>

            {/* Show Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Show Time *
              </label>
              <input
                type="time"
                name="show_time"
                value={formData.show_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              {errors.show_time && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                  {errors.show_time}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ticket Price (Rp) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1000"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="e.g. 50000"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: Rp 35,000 - Rp 75,000</p>
              {errors.price && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                  {errors.price}
                </p>
              )}
            </div>

            {/* Preview Info */}
            {formData.movie_id && formData.studio_id && formData.show_date && formData.show_time && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Schedule Preview</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Movie: {Array.isArray(movies) ? movies.find(m => m.id == formData.movie_id)?.name : 'N/A'}</div>
                  <div>Studio: {Array.isArray(studios) ? studios.find(s => s.id == formData.studio_id)?.name : 'N/A'}</div>
                  <div>Date: {new Date(formData.show_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div>Time: {formData.show_time}</div>
                  {formData.price && <div>Price: Rp {parseInt(formData.price).toLocaleString('id-ID')}</div>}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg hover:from-orange-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  schedule ? 'Update Schedule' : 'Create Schedule'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;