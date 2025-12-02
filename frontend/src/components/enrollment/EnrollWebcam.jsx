import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { enrollFromWebcam } from '../../services/api';
import Modal from '../common/Modal';
import Button from '../common/Button';

const EnrollWebcam = ({ onClose }) => {
  const [name, setName] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const handleEnroll = async () => {
    if (!name.trim()) {
      setModal({
        isOpen: true,
        title: 'Name Required',
        message: 'Please enter a name before enrolling.',
        type: 'error'
      });
      return;
    }

    if (!capturedImage) {
      setModal({
        isOpen: true,
        title: 'No Image',
        message: 'Please capture an image first.',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await enrollFromWebcam(name, capturedImage);
      
      if (result.success) {
        setModal({
          isOpen: true,
          title: 'Enrollment Successful!',
          message: `${result.name} has been enrolled successfully.`,
          type: 'success'
        });
        
        // Reset form
        setTimeout(() => {
          setName('');
          setCapturedImage(null);
          onClose();
        }, 7000);
      } else {
        setModal({
          isOpen: true,
          title: 'Enrollment Failed',
          message: result.message || 'No face detected. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.detail || 'Failed to enroll. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-600">Enroll from Webcam</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Enter Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none text-lg"
              />
            </div>

            {/* Webcam/Image Display */}
                          <div className="bg-slate-100 rounded-lg overflow-hidden border-4 border-slate-200">
              {!capturedImage ? (
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
              ) : (
                <img src={capturedImage} alt="Captured" className="w-full" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!capturedImage ? (
                <Button onClick={capture} variant="primary" className="flex-1" icon="📸">
                  Capture Photo
                </Button>
              ) : (
                <>
                  <Button onClick={retake} variant="outline" className="flex-1" icon="🔄">
                    Retake
                  </Button>
                  <Button
                    onClick={handleEnroll}
                    variant="secondary"
                    disabled={loading}
                    className="flex-1"
                    icon="✅"
                  >
                    {loading ? 'Enrolling...' : 'Enroll'}
                  </Button>
                </>
              )}
            </div>

            <Button onClick={onClose} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default EnrollWebcam;