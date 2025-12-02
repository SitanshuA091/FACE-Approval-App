import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { approveEntry } from '../../services/api';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ApproveEntry = ({ onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Start continuous recognition
    startRecognition();

    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecognition = () => {
    // Check for faces every 2 seconds
    intervalRef.current = setInterval(() => {
      if (!isProcessing && webcamRef.current) {
        recognizeFace();
      }
    }, 2000);
  };

  const recognizeFace = async () => {
    if (!webcamRef.current) return;

    setIsProcessing(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setIsProcessing(false);
        return;
      }

      const result = await approveEntry(imageSrc);

      if (result.success) {
        // Stop continuous recognition
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        setModal({
          isOpen: true,
          title: 'Entry Approved ✅',
          message: `Welcome, ${result.name}!`,
          type: 'success'
        });

        // Close the entire modal after success message closes
        setTimeout(() => {
          onClose();
        }, 7000);
      }
    } catch (error) {
      // Silently continue - don't show error for unrecognized faces
      console.log('Face not recognized or error:', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  };

  const handleModalClose = () => {
    // When user manually closes success modal, close the entire component
    setModal({ isOpen: false, title: '', message: '', type: 'success' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-600">Approve Entry</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-3xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Indicator */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <p className="text-lg font-semibold text-slate-800">
                  {isProcessing ? 'Processing...' : 'Ready - Show your face to the camera'}
                </p>
              </div>
            </div>

            {/* Webcam */}
            <div className="bg-slate-100 rounded-lg overflow-hidden border-4 border-slate-200">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
              />
            </div>

            {/* Instructions */}
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-2">Instructions:</h3>
              <ul className="list-disc list-inside text-green-700 space-y-1">
                <li>Position your face clearly in front of the camera</li>
                <li>Keep your face steady for recognition</li>
                <li>System checks automatically every 2 seconds</li>
                <li>Camera will close after successful recognition</li>
                <li>Press "Approve Entry" button again for next person</li>
              </ul>
            </div>

            {/* Close Button */}
            <Button onClick={handleClose} variant="danger" className="w-full" icon="🚪">
              Stop & Close
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        autoClose={true}
        autoCloseDelay={7000}
      />
    </div>
  );
};

export default ApproveEntry;