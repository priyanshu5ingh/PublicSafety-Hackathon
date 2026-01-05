import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPinIcon } from '@heroicons/react/24/outline';
import TransitionOverlay from '../components/TransitionOverlay';

const ReportCrime = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    crimeType: 'Theft',
    description: '',
    locationName: '',
    latitude: '',
    longitude: '',
    evidence: '',
    witnesses: '',
    evidence_images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowTransition(true);
    setTransitionMsg('Submitting your report...');
    if (!formData.latitude || !formData.longitude) {
      setTransitionMsg('Error: Please get your location first');
      setTimeout(() => setShowTransition(false), 3000);
      setIsLoading(false);
      return;
    }
    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'evidence_images') {
          submitFormData.append(key, formData[key]);
        }
      });
      if (formData.evidence_images.length > 0) {
        formData.evidence_images.forEach((image) => {
          submitFormData.append('evidence_images', image);
        });
      }

      console.log('Submitting data:', {
        ...formData,
        evidence_images: `${formData.evidence_images.length} files`
      });

      const response = await axios.post('http://localhost:5001/api/crime', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setTransitionMsg('Report submitted successfully!');
        setTimeout(() => {
          setShowTransition(false);
          navigate('/map');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Failed to submit report');
      }
    } catch (error) {
      setTransitionMsg('Error: ' + (error.response?.data?.message || error.message || 'Failed to submit report'));
      setTimeout(() => {
        setShowTransition(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
    setFormData(prev => ({
      ...prev,
      evidence_images: [...prev.evidence_images, ...files]
    }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      evidence_images: prev.evidence_images.filter((_, i) => i !== index)
    }));
  };

  const handleLocationClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              { headers: { 'User-Agent': 'NammaSuraksha/1.0' } }
            );
            setFormData(prev => ({
              ...prev,
              locationName: response.data.display_name || `${latitude}, ${longitude}`,
              latitude: latitude.toString(),
              longitude: longitude.toString()
            }));
          } catch (error) {
            alert("Error getting location name. The coordinates will be used instead.");
            setFormData(prev => ({
              ...prev,
              locationName: `${position.coords.latitude}, ${position.coords.longitude}`,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }));
          }
        },
        () => {
          alert("Error getting your location. Please try again or enter manually.");
        }
      );
    }
  };

  return (
    <>
      <TransitionOverlay show={showTransition} message={transitionMsg} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-8 shadow-2xl transition-all duration-300 hover:bg-white/40">
            <h2 className="text-3xl font-bold text-white text-center mb-8 transition-all duration-300 hover:scale-105">Report a Crime</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Crime Type
                </label>
                <select
                  name="crimeType"
                  value={formData.crimeType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <option value="Theft" className="bg-indigo-900">Theft</option>
                  <option value="Assault" className="bg-indigo-900">Assault</option>
                  <option value="Harassment" className="bg-indigo-900">Harassment</option>
                  <option value="Vandalism" className="bg-indigo-900">Vandalism</option>
                  <option value="Other" className="bg-indigo-900">Other</option>
                </select>
              </div>
              <div className="transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                  placeholder="Describe what happened..."
                />
              </div>
              <div className="transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Location
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                    placeholder="Enter location or use Get Location"
                  />
                  <button
                    type="button"
                    onClick={handleLocationClick}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg transition-colors duration-200"
                  >
                    <MapPinIcon className="h-5 w-5" />
                    Get Location
                  </button>
                </div>
              </div>
              <div className="transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Evidence (optional)
                </label>
                <input
                  type="text"
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                  placeholder="Describe any evidence (optional)"
                />
              </div>
              <div className="transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Witnesses (optional)
                </label>
                <input
                  type="text"
                  name="witnesses"
                  value={formData.witnesses}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/30"
                  placeholder="List witnesses (optional)"
                />
              </div>
              <div className="transition-all duration-300 hover:translate-x-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Upload Evidence Images (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-white/40" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportCrime; 