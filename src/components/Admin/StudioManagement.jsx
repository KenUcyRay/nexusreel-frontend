/* eslint-disable */
import { useState, useEffect } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import StudioForm from './StudioForm';
import StudioPreview from './StudioPreview';
import Toast from '../ui/Toast';
import studioService from '../../services/studioService';
import { useToast } from '../../hooks/useToast';

const StudioManagement = () => {
  const [studios, setStudios] = useState([]);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewStudio, setPreviewStudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadStudios();
  }, []);

  const loadStudios = async () => {
    setLoading(true);
    try {
      const response = await studioService.getStudios();
      setStudios(response.data.data || []);
    } catch (error) {
      // Studios endpoint not available - set empty array
      setStudios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedStudio(null);
    setShowForm(true);
  };

  const handleEdit = (studio) => {
    setSelectedStudio(studio);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this studio?')) {
      try {
        await studioService.deleteStudio(id);
        showToast('Studio deleted successfully', 'success');
        loadStudios();
      } catch (error) {
        console.error('Failed to delete studio:', error);
        showToast(
          error.response?.data?.message || 'Failed to delete studio',
          'error'
        );
      }
    }
  };

  const handleSave = async (studioData) => {
    try {
      if (selectedStudio) {
        await studioService.updateStudio(selectedStudio.id, studioData);
        showToast('Studio updated successfully', 'success');
      } else {
        await studioService.createStudio(studioData);
        showToast('Studio created successfully', 'success');
      }
      setShowForm(false);
      setSelectedStudio(null);
      loadStudios();
    } catch (error) {
      console.error('Failed to save studio:', error);
      throw error;
    }
  };

  const handlePreview = (studio) => {
    setPreviewStudio(studio);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Studio Management</h1>
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Studio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Studio List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Studios</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {studios.map(studio => (
              <div key={studio.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{studio.name}</h3>
                    <p className="text-sm text-gray-600">Type: {studio.type}</p>
                    <p className="text-sm text-gray-600">
                      Size: {studio.rows} x {studio.columns} ({studio.total_seats} seats)
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      studio.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {studio.status}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handlePreview(studio)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      title="Preview Studio"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(studio)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Edit Studio"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(studio.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Delete Studio"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              ))}
              {studios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No studios found. Create your first studio!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Studio Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Studio Preview</h2>
          {previewStudio ? (
            <StudioPreview studio={previewStudio} />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a studio to preview
            </div>
          )}
        </div>
      </div>

      {/* Studio Form Modal */}
      {showForm && (
        <StudioForm
          studio={selectedStudio}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedStudio(null);
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

export default StudioManagement;