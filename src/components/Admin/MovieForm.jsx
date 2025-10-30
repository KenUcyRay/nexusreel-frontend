import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';

const MovieForm = ({ movie, onClose, onSave, showToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        duration: '',
        status: 'coming_soon',
        description: '',
        rating: '',
        director: '',
        production_team: '',
        trailer_url: '',
        trailer_type: 'url'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [trailerFile, setTrailerFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (movie) {
            setFormData({
                name: movie.name || '',
                genre: movie.genre || '',
                duration: movie.duration || '',
                status: movie.status || 'coming_soon',
                description: movie.description || '',
                rating: movie.rating || '',
                director: movie.director || '',
                production_team: movie.production_team || '',
                trailer_url: movie.trailer_url || '',
                trailer_type: movie.trailer_type || 'url'
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
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('Image size must be less than 2MB', 'error');
                return;
            }

            setImageFile(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTrailerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                showToast('Please select a video file', 'error');
                return;
            }
            
            if (file.size > 50 * 1024 * 1024) {
                showToast('Video size must be less than 50MB', 'error');
                return;
            }

            setTrailerFile(file);
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
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (!formData.rating.trim()) {
            newErrors.rating = 'Rating is required';
        }
        
        if (!formData.director.trim()) {
            newErrors.director = 'Director is required';
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
            submitData.append('description', formData.description);
            submitData.append('rating', formData.rating);
            submitData.append('director', formData.director);
            submitData.append('production_team', formData.production_team);
            submitData.append('trailer_type', formData.trailer_type);
            
            if (formData.trailer_type === 'url') {
                submitData.append('trailer_url', formData.trailer_url);
            }
            
            if (imageFile) {
                submitData.append('image', imageFile);
            }
            
            if (trailerFile) {
                submitData.append('trailer_file', trailerFile);
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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-grey" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                {movie ? 'Edit Movie' : 'Add New Movie'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-red-400 hover:text-gray-200 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 80px)' }}>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Movie Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Movie Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter movie name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Genre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Genre *
                        </label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="e.g. Action, Adventure, Drama"
                        />
                        {errors.genre && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.genre}
                            </p>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="e.g. 120"
                        />
                        {errors.duration && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.duration}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status *
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        >
                            <option value="coming_soon">Coming Soon</option>
                            <option value="live_now">Live Now</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter movie description"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rating *
                        </label>
                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        >
                            <option value="">Select Rating</option>
                            <option value="G">G - General Audiences</option>
                            <option value="PG">PG - Parental Guidance</option>
                            <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                            <option value="R">R - Restricted</option>
                            <option value="NC-17">NC-17 - Adults Only</option>
                        </select>
                        {errors.rating && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.rating}
                            </p>
                        )}
                    </div>

                    {/* Director */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Director *
                        </label>
                        <input
                            type="text"
                            name="director"
                            value={formData.director}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter director name"
                        />
                        {errors.director && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.director}
                            </p>
                        )}
                    </div>

                    {/* Production Team */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Production Team
                        </label>
                        <input
                            type="text"
                            name="production_team"
                            value={formData.production_team}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Enter production team"
                        />
                    </div>

                    {/* Trailer */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Trailer
                        </label>
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="trailer_type"
                                        value="url"
                                        checked={formData.trailer_type === 'url'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    URL
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="trailer_type"
                                        value="upload"
                                        checked={formData.trailer_type === 'upload'}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Upload Video
                                </label>
                            </div>
                            
                            {formData.trailer_type === 'url' ? (
                                <input
                                    type="url"
                                    name="trailer_url"
                                    value={formData.trailer_url}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="Enter trailer URL (YouTube, Vimeo, etc.)"
                                />
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleTrailerChange}
                                        className="hidden"
                                        id="trailer-upload"
                                    />
                                    <label
                                        htmlFor="trailer-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <Upload className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 mb-1">
                                            {trailerFile ? trailerFile.name : 'Click to upload trailer'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            MP4, AVI, MOV up to 50MB
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Movie Poster {!movie && '*'}
                        </label>
                        
                        {imagePreview && (
                            <div className="mb-4 flex justify-center">
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-40 h-56 object-cover rounded-xl shadow-lg border-2 border-gray-200"
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
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
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                    <Upload className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 mb-1">
                                    Click to upload poster
                                </span>
                                <span className="text-xs text-gray-500">
                                    PNG, JPG up to 2MB
                                </span>
                            </label>
                        </div>
                        
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                </span>
                                {errors.image}
                            </p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
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
                                movie ? 'Update Movie' : 'Create Movie'
                            )}
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};

export default MovieForm;