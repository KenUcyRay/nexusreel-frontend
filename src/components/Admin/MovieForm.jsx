import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';

const MovieForm = ({ movie, onClose, onSave, showToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        duration: '',
        status: 'coming_soon'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (movie) {
            setFormData({
                name: movie.name || '',
                genre: movie.genre || '',
                duration: movie.duration || '',
                status: movie.status || 'coming_soon'
            });
            if (movie.image) {
                setImagePreview(`http://localhost:8000/storage/${movie.image}`);
            }
        }
    }, [movie]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }
            
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast('Image size must be less than 2MB', 'error');
                return;
            }

            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Movie name is required';
        }
        
        if (!formData.genre.trim()) {
            newErrors.genre = 'Genre is required';
        }
        
        if (!formData.duration || formData.duration < 1) {
            newErrors.duration = 'Duration must be at least 1 minute';
        }
        
        if (!movie && !imageFile) {
            newErrors.image = 'Image is required for new movie';
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
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('genre', formData.genre);
            submitData.append('duration', formData.duration);
            submitData.append('status', formData.status);
            
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            let response;
            if (movie) {
                // Update existing movie
                submitData.append('_method', 'PUT');
                response = await api.post(`/api/admin/movies/${movie.id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } else {
                // Create new movie
                response = await api.post('/api/admin/movies', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }

            showToast(
                movie ? 'Movie updated successfully' : 'Movie created successfully',
                'success'
            );
            onSave(response.data);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                showToast(
                    error.response?.data?.message || 'Failed to save movie',
                    'error'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {movie ? 'Edit Movie' : 'Add New Movie'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Movie Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Movie Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter movie name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Genre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Genre *
                        </label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. Action, Adventure, Drama"
                        />
                        {errors.genre && (
                            <p className="text-red-500 text-sm mt-1">{errors.genre}</p>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g. 120"
                        />
                        {errors.duration && (
                            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="coming_soon">Coming Soon</option>
                            <option value="live_now">Live Now</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Movie Poster {!movie && '*'}
                        </label>
                        
                        {imagePreview && (
                            <div className="mb-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-48 object-cover rounded border"
                                />
                            </div>
                        )}
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                    Click to upload image
                                </span>
                                <span className="text-xs text-gray-400">
                                    PNG, JPG up to 2MB
                                </span>
                            </label>
                        </div>
                        
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (movie ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MovieForm;