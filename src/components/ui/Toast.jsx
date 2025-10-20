import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white';
      default:
        return 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg ${getToastStyles()}`}>
        {getIcon()}
        <span className="ml-3 text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;