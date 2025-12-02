import React, { useState } from 'react';
import { enrollFromFile } from '../../services/api';
import Modal from '../common/Modal';
import Button from '../common/Button';

const EnrollFile = ({ onClose }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
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

    if (!file) {
      setModal({
        isOpen: true,
        title: 'No File Selected',
        message: 'Please select an image file.',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await enrollFromFile(name, file);
      
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
          setFile(null);
          setPreview(null);
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
            <h2 className="text-3xl font-bold text-gray-700">Enroll from File</h2>
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
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:border-gray-600 focus:outline-none text-lg bg-gray-50"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="bg-gray-200 rounded-lg overflow-hidden border-4 border-gray-400">
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleEnroll}
                variant="secondary"
                disabled={loading}
                className="flex-1"
                icon="✅"
              >
                {loading ? 'Enrolling...' : 'Enroll'}
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
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

export default EnrollFile;