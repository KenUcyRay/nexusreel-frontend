import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import registerImage from '../../assets/register.png';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register form submitted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FFD700] to-[#FFA500]">
      <div className="flex min-h-screen">
        <div className="flex w-full md:w-1/2 items-center justify-center px-8 py-12">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-sm p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl text-gray-900 font-bold mb-1">Create Account</h2>
              <p className="text-gray-600 text-sm">Join Nexus Cinema today</p>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>



              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-sm">Remember me</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white font-semibold rounded-lg hover:opacity-90 transition duration-200 text-sm"
              >
                Create Account
              </button>
            </form>

            <div className="flex items-center my-4">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span className="px-4 text-xs text-gray-400">or</span>
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

        <div className="hidden md:flex w-1/2 items-center justify-center px-8 py-12">
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