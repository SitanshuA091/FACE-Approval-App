import React, { useState } from 'react';
import Button from '../components/common/Button';
import EnrollWebcam from '../components/enrollment/EnrollWebcam';
import EnrollFile from '../components/enrollment/EnrollFile';
import ApproveEntry from '../components/approval/ApproveEntry';

const HomePage = () => {
  const [showEnrollWebcam, setShowEnrollWebcam] = useState(false);
  const [showEnrollFile, setShowEnrollFile] = useState(false);
  const [showApproveEntry, setShowApproveEntry] = useState(false);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to FaceApproval
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI-Powered Attendance Management System
          </p>
          <p className="text-lg text-gray-500">
            Choose an option below to get started
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Light Blue-Grey */}
          <ActionCard
            icon="📸"
            title="Enroll from Webcam"
            description="Capture face using your device camera"
            onClick={() => setShowEnrollWebcam(true)}
            color="lightblue"
          />

          {/* Card 2 - Dark Grey */}
          <ActionCard
            icon="📁"
            title="Enroll from File"
            description="Upload a photo from your device"
            onClick={() => setShowEnrollFile(true)}
            color="darkgrey"
          />

          {/* Card 3 - Purple */}
          <ActionCard
            icon="✅"
            title="Approve Entry"
            description="Mark attendance with face recognition"
            onClick={() => setShowApproveEntry(true)}
            color="purple"
          />
        </div>

        {/* Info Section */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <InfoStep
              number="1"
              title="Enroll"
              description="Register users by capturing or uploading their face photo"
            />
            <InfoStep
              number="2"
              title="Recognize"
              description="System automatically identifies enrolled users"
            />
            <InfoStep
              number="3"
              title="Track"
              description="View attendance records and statistics in dashboard"
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEnrollWebcam && <EnrollWebcam onClose={() => setShowEnrollWebcam(false)} />}
      {showEnrollFile && <EnrollFile onClose={() => setShowEnrollFile(false)} />}
      {showApproveEntry && <ApproveEntry onClose={() => setShowApproveEntry(false)} />}
    </div>
  );
};

const ActionCard = ({ icon, title, description, onClick, color }) => {
  const colors = {
    lightblue: 'from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600',
    darkgrey: 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg p-8 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
};

const InfoStep = ({ number, title, description }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-slate-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-700">{description}</p>
      </div>
    </div>
  );
};

export default HomePage;