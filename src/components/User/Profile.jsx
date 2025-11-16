import React, { useState, useEffect } from 'react';
import { User, Mail, Edit, Camera, Save, Lock, Phone } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../ui/MainNavbar";
import api from '../../utils/api';

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    created_at: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
    loadUserProfile();
  }, []);

  // Clear errors when form data changes
  useEffect(() => {
    if (formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: null }));
    }
    if (formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: null }));
    }
    if (formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  }, [formData]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/api/user');
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });
      if (userData.avatar) {
        setAvatarPreview(`http://localhost:8000/storage/${userData.avatar}`);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
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
    
    console.log('🔍 DEBUG - Form data before validation:', formData);
    
    // Validasi frontend yang lebih robust
    const nameValue = String(formData.name || '').trim();
    const emailValue = String(formData.email || '').trim();
    const phoneValue = String(formData.phone || '').trim();
    
    if (!nameValue || !emailValue || !phoneValue) {
      console.log('❌ Validation failed');
      setErrors({ 
        name: !nameValue ? ['Name is required'] : null,
        email: !emailValue ? ['Email is required'] : null,
        phone: !phoneValue ? ['Phone is required'] : null
      });
      setLoading(false);
      return;
    }
    
    console.log('✅ All validations passed');
    
    try {
      // Get CSRF token first
      await api.get('/sanctum/csrf-cookie');
      
      // Update profile data first
      console.log('🚀 Updating profile data (JSON)');
      await api.put('/api/user/profile', {
        name: nameValue,
        email: emailValue,
        phone: phoneValue
      });
      
      let response;
      
      // Upload avatar separately if provided
      if (avatarFile) {
        console.log('📷 Uploading avatar separately');
        const avatarData = new FormData();
        avatarData.append('avatar', avatarFile);
        
        response = await api.post('/api/user/avatar', avatarData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Get updated user data
        response = await api.get('/api/user');
      }
      
      setUser(response.data.user || response.data);
      setAvatarFile(null);
      setIsEditing(false);
      alert('Profile updated successfully!');
      await loadUserProfile();
    } catch (error) {
      console.error('❌ Profile update error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Full error object:', error);
      
      if (error.response?.data?.errors) {
        console.error('❌ Validation errors:', error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile';
        alert(`Update failed: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-80 sm:h-96 bg-gradient-to-r from-gray-900 to-gray-700 pt-28 sm:pt-40">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-white text-center" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">My Profile</h1>
              <p className="text-lg sm:text-xl text-gray-300">Manage Your Account Information</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera className="w-3 h-3 text-gray-600" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name}</h2>
                  <p className="text-white/90">Member</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 sm:p-8">
              {isEditing ? (
                <div className="space-y-6">
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
                        setAvatarFile(null);
                        setAvatarPreview(user.avatar ? `http://localhost:8000/storage/${user.avatar}` : '');
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-[#FFA500]" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-[#FFA500]" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-semibold">{user.phone || 'Not set'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-[#FFA500]" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-semibold">{user.created_at ? formatDate(user.created_at) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}