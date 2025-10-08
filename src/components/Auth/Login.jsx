import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import loginImage from '../../assets/login.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted');
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
              <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mb-1">Welcome Back</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Sign in to your account</p>
            </div>

            <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit}>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-gray-700 font-medium text-xs sm:text-sm">
                    {loginMethod === 'email' ? 'Email' : 'Phone'}
                  </label>
                  <div className="flex gap-2 sm:gap-3">
                    <label className="flex items-center gap-1 cursor-pointer" onClick={() => setLoginMethod('email')}>
                      <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border flex items-center justify-center ${
                        loginMethod === 'email' ? 'border-orange-400' : 'border-gray-300'
                      }`}>
                        {loginMethod === 'email' && (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]" />
                        )}
                      </span>
                      <span className="text-xs text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer" onClick={() => setLoginMethod('phone')}>
                      <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border flex items-center justify-center ${
                        loginMethod === 'phone' ? 'border-orange-400' : 'border-gray-300'
                      }`}>
                        {loginMethod === 'phone' && (
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]" />
                        )}
                      </span>
                      <span className="text-xs text-gray-700">Phone</span>
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone'}
                    className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-xs sm:text-sm"
                    value={loginMethod === 'email' ? email : phone}
                    onChange={(e) => loginMethod === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
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

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 sm:gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500"
                  />
                  <span className="text-xs">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-orange-600 hover:underline text-xs">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200 text-xs sm:text-sm"
              >
                Sign In
              </button>
            </form>

            <div className="flex items-center my-3 sm:my-4">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="px-3 sm:px-4 text-xs text-gray-400">or</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>

            <p className="text-center text-xs text-gray-700">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 items-center justify-center px-6 sm:px-8 py-8 sm:py-12">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-4/5 drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}