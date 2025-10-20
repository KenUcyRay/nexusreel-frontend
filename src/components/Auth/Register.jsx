import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Home } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import registerImage from '../../assets/register.png';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const userData = {
        name,
        email,
        password,
        password_confirmation: confirmPassword
      };
      
      const result = await register(userData);
      if (result.user) {
        navigate('/home');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
      {/* Back to Website Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Website
        </button>
      </div>
      
      <div className="flex min-h-screen">
        <div className="flex w-full md:w-1/2 items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-sm p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mb-1">Create Account</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Join Nexus Cinema today</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs">
                {error}
              </div>
            )}

            <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>



              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="w-full pl-8 sm:pl-9 pr-8 sm:pr-10 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full pl-8 sm:pl-9 pr-8 sm:pr-10 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>



              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200 text-xs sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center my-3 sm:my-4">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="px-3 sm:px-4 text-xs text-gray-400">or</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>

            <p className="text-center text-xs text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 items-center justify-center px-6 sm:px-8 py-8 sm:py-12">
          <img
            src={registerImage}
            alt="Register Illustration"
            className="w-4/5 drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}