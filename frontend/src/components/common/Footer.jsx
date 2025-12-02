import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-slate-100">
            Made by Sitanshu Anmol
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">@</span>
            <p className="text-xl font-bold tracking-wide">
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-200">
            2025
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-600">
          <div className="text-center text-slate-300 text-sm">
            <p>Facial Recognition Attendance System</p>
            <p className="mt-1">Powered by AI Technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;