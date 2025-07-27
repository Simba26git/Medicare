import React, { useState, useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform";
    
    if (!isVisible) {
      return `${baseStyles} opacity-0 translate-x-full`;
    }

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white`;
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center space-x-3">
        <span className="text-lg">{getIcon()}</span>
        <p className="font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="ml-auto text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
