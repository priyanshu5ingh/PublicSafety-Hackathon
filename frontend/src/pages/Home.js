import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Welcome to Namma Suraksha...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center animate-fade-in">
          Welcome to Namma Suraksha
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          <button
            onClick={() => navigate('/map')}
            className="group bg-white/30 hover:bg-white/40 p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center border-2 border-white/40 hover:border-white/60 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Crime Map 🗺️</h2>
            <p className="text-white text-sm">View crime hotspots and stay informed</p>
          </button>

          <button
            onClick={() => navigate('/incidents')}
            className="group bg-white/30 hover:bg-white/40 p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center border-2 border-white/40 hover:border-white/60 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Reported Incidents 📋</h2>
            <p className="text-white text-sm">View all reported incidents</p>
          </button>

          <button
            onClick={() => navigate('/report')}
            className="group bg-white/30 hover:bg-white/40 p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center border-2 border-white/40 hover:border-white/60 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white mb-2">Report Incident ⚠️</h2>
            <p className="text-white text-sm">Report suspicious activities</p>
          </button>
        </div>
        <p className="text-white text-center text-base max-w-2xl">
          Together, we can make our community safer. Report incidents, stay informed, and help create a secure environment for everyone.
        </p>
      </div>
    </div>
  );
}
