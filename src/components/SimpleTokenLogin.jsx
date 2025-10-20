import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import axios from 'axios';

export default function SimpleTokenLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('user@cinema.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting token-based login...');
      
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful:', response.data);
      
      // Store token
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
      <div className="flex min-h-screen">
        <div className="flex w-full md:w-1/2 items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-sm p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mb-1">Token Login</h2>
              <p className="text-gray-600 text-xs sm:text-sm">No CSRF - Simple Token Auth</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs">
                {error}
              </div>
            )}

            <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs sm:text-sm">
                  Email
                </label>
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
                    placeholder="Enter your password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200 text-xs sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>🔑 Token-Based Auth:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>No CSRF tokens needed</li>
                <li>Direct API calls</li>
                <li>Bearer token authentication</li>
              </ul>
            </div>

            <p className="text-center text-xs text-gray-700 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}