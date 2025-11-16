/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Camera, Mail, Lock, User, Save, Upload } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const ProfileAdmin = () => {
    const { user } = useAuthContext();
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        avatar: null,
        role: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        setUserProfile(user);
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size must be less than 2MB');
                return;
            }
            
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setErrors({});
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            
            if (avatarFile) {
                submitData.append('avatar', avatarFile);
            }
            
            const response = await api.post('/api/profile/update', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            setUserProfile(response.data.user);
            setAvatarFile(null);
            alert('Profile updated successfully!');
            await loadUserProfile();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Failed to update profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        
        setLoading(true);
        setErrors({});
        try {
            await api.post('/api/profile/change-password', {
                current_password: formData.currentPassword,
                new_password: formData.newPassword,
                new_password_confirmation: formData.confirmPassword
            });
            
            alert('Password changed successfully!');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Failed to change password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Profile</h1>
                        <p className="text-sm text-gray-600">Manage your account settings</p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                                    activeTab === 'profile'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                                    activeTab === 'password'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Change Password
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center overflow-hidden">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 sm:p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                            <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-base sm:text-lg font-medium text-gray-900">Profile Photo</h3>
                                        <p className="text-xs sm:text-sm text-gray-500">Click the camera icon to upload a new photo</p>
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                                    )}
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                {/* Change Password Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                        className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAdmin;