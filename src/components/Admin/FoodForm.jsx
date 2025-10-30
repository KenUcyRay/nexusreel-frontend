import React, { useState, useEffect } from 'react';
import { X, Upload, Coffee } from 'lucide-react';
import api from '../../utils/api';

const FoodForm = ({ food, onClose, onSave, showToast }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'snack',
        is_available: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (food) {
            setFormData({
                name: food.name || '',
                description: food.description || '',
                price: food.price || '',
                category: food.category || 'snack',
                is_available: food.is_active !== undefined ? food.is_active : true
            });
            if (food.image) {
                setImagePreview(`http://localhost:8000/storage/${food.image}`);
            }
        }
    }, [food]);

    const handleInputChange = (e) => {
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

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Food name is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        const price = parseFloat(formData.price);
        if (!formData.price || price < 1) {
            newErrors.price = 'Price must be at least Rp 1';
        } else if (price > 999999.99) {
            newErrors.price = 'Price cannot exceed Rp 999,999';
        }
        
        if (!food && !imageFile) {
            newErrors.image = 'Image is required for new food item';
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
            let response;
            
            if (food) {
                // For updates, use regular JSON if no new image
                if (imageFile) {
                    const submitData = new FormData();
                    submitData.append('name', formData.name);
                    submitData.append('description', formData.description);
                    submitData.append('price', formData.price);
                    submitData.append('category', formData.category);
                    submitData.append('is_active', formData.is_available ? '1' : '0');
                    submitData.append('image', imageFile);
                    submitData.append('_method', 'PUT');
                    
                    response = await api.post(`/api/admin/foods/${food.id}`, submitData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                } else {
                    // Update without image
                    response = await api.put(`/api/admin/foods/${food.id}`, {
                        name: formData.name,
                        description: formData.description,
                        price: parseInt(formData.price),
                        category: formData.category,
                        is_active: formData.is_available
                    });
                }
            } else {
                // For new food, always use FormData
                const submitData = new FormData();
                submitData.append('name', formData.name);
                submitData.append('description', formData.description);
                submitData.append('price', formData.price);
                submitData.append('category', formData.category);
                submitData.append('is_active', formData.is_available ? '1' : '0');
                
                if (imageFile) {
                    submitData.append('image', imageFile);
                }
                
                response = await api.post('/api/admin/foods', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }

            showToast(
                food ? 'Food updated successfully' : 'Food created successfully',
                'success'
            );
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Food save error:', error.response?.data);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                const errorMessages = Object.values(error.response.data.errors).flat();
                showToast(errorMessages.join(', '), 'error');
            } else {
                showToast(
                    error.response?.data?.message || 'Failed to save food item',
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
                                <Coffee className="w-5 h-5 text-grey" />
                            </div>
                            <h2 className="text-xl font-bold text-white">
                                {food ? 'Edit Food Item' : 'Add New Food Item'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-red-600 hover:text-gray-200 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 80px)' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Food Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Food Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter food name"
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

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Enter food description"
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

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price (Rp) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min="1"
                                max="999999"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="e.g. 25000 (max: 999,999)"
                            />
                            <p className="text-xs text-gray-500 mt-1">Maximum price: Rp 999,999</p>
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    </span>
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                            >
                                <option value="snack">Snack</option>
                                <option value="drink">Drink</option>
                                <option value="combo">Combo</option>
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-2">{errors.category}</p>
                            )}
                        </div>

                        {/* Availability */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Availability Status
                            </label>
                            <div className="flex items-center space-x-3">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={formData.is_available}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Available for sale
                                    </span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.is_available ? 'Customers can order this item' : 'Item is temporarily unavailable'}
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Food Image {!food && '*'}
                            </label>
                            
                            {imagePreview && (
                                <div className="mb-4 flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-40 h-32 object-cover rounded-xl shadow-lg border-2 border-gray-200"
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
                                        Click to upload image
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
                                    food ? 'Update Food' : 'Create Food'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FoodForm;