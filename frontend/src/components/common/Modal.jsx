import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success',
  autoClose = true,
  autoCloseDelay = 7000 
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      icon: '✅',
      iconBg: 'bg-green-100',
      textColor: 'text-green-800',
      titleColor: 'text-green-900'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      icon: '❌',
      iconBg: 'bg-red-100',
      textColor: 'text-red-800',
      titleColor: 'text-red-900'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-900'
    }
  };

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`${style.bg} border-4 ${style.border} rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100`}>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className={`${style.iconBg} rounded-full p-4`}>
              <span className="text-5xl">{style.icon}</span>
            </div>
          </div>
          
          <h3 className={`text-2xl font-bold text-center mb-4 ${style.titleColor}`}>
            {title}
          </h3>
          
          <p className={`text-lg text-center mb-6 ${style.textColor}`}>
            {message}
          </p>

          {autoClose && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Auto-closing in {autoCloseDelay / 1000} seconds...
              </p>
            </div>
          )}
          
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className={`px-8 py-3 ${style.border} border-2 ${style.textColor} rounded-lg font-semibold hover:bg-white transition-all duration-200`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;