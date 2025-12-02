import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-3 shadow-md">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">FaceApproval</h1>
              <p className="text-slate-100 text-sm">Attendance Management System</p>
            </div>
          </div>

          <nav className="flex space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                isHome
                  ? 'bg-white text-slate-600 shadow-md'
                  : 'text-white hover:bg-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                !isHome
                  ? 'bg-white text-slate-600 shadow-md'
                  : 'text-white hover:bg-slate-700'
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;