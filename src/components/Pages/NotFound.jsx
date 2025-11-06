import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-9xl font-bold mb-4 text-[#FFD700]">404</h1>
        <h2 className="text-4xl font-bold mb-6">Page Not Found</h2>
        <p className="text-xl mb-8 text-gray-300">
          The page you're looking for doesn't exist.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
}