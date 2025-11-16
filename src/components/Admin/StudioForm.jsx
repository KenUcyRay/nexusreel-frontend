import { useState, useEffect } from 'react';
import { X, DoorOpen } from 'lucide-react';

const StudioForm = ({ studio, onSave, onCancel, showToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Regular',
    status: 'active',
    rows: 10,
    columns: 14
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studio) {
      setFormData({
        name: studio.name,
        type: studio.type,
        status: studio.status,
        rows: studio.rows,
        columns: studio.columns
      });
    }
  }, [studio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rows' || name === 'columns' ? parseInt(value) || 0 : value
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Studio name is required';
    }
    
    if (formData.rows < 1 || formData.rows > 20) {
      newErrors.rows = 'Rows must be between 1 and 20';
    }
    
    if (formData.columns < 1 || formData.columns > 20) {
      newErrors.columns = 'Columns must be between 1 and 20';
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
      await onSave(formData);
    } catch (error) {
      console.error('Studio save error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        const errorMessages = Object.values(error.response.data.errors).flat();
        showToast(errorMessages.join(', '), 'error');
      } else {
        showToast(
          error.response?.data?.message || 'Failed to save studio',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const totalSeats = formData.rows * formData.columns;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <DoorOpen className="w-5 h-5 text-grey" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {studio ? 'Edit Studio' : 'Add New Studio'}
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
            {/* Studio Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Studio Name *
              </label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="">Select Studio</option>
                <option value="Studio 1">Studio 1</option>
                <option value="Studio 2">Studio 2</option>
                <option value="Studio 3">Studio 3</option>
                <option value="Studio 4">Studio 4</option>
                <option value="Studio 5">Studio 5</option>
              </select>
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Studio Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Studio Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="Regular">Regular</option>
                <option value="Premium">Premium</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Rows and Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rows *
                </label>
                <input
                  type="number"
                  name="rows"
                  value={formData.rows}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.rows && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.rows}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Columns *
                </label>
                <input
                  type="number"
                  name="columns"
                  value={formData.columns}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {errors.columns && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                    {errors.columns}
                  </p>
                )}
              </div>
            </div>

            {/* Total Seats Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Total Seats: <span className="font-semibold text-lg text-gray-800">{totalSeats}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Layout: {formData.rows} rows × {formData.columns} columns
              </p>
            </div>

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
                  studio ? 'Update Studio' : 'Create Studio'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudioForm;