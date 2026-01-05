import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function ReportedIncidents() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/crime");
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = filter
    ? reports.filter((r) => r.crimeType === filter)
    : reports;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-700 via-purple-800 to-indigo-900">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading incidents... 🕵️‍♂️</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-700 via-purple-800 to-indigo-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <button
            onClick={() => navigate('/report')}
            className="flex items-center gap-2 bg-white/40 hover:bg-white/60 text-indigo-900 px-8 py-3 rounded-full font-medium transition-colors duration-200 shadow-lg text-lg"
          >
            <MapPinIcon className="h-5 w-5" />
            Report New Incident 🚨
          </button>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/40 text-indigo-900 border-0 px-8 py-3 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer hover:bg-white/60 transition-colors duration-200 shadow-lg text-lg max-w-xs"
            style={{maxHeight: '3rem'}}
          >
            <option value="">All Types 🌐</option>
            <option value="Theft">Theft 🕵️‍♀️</option>
            <option value="Assault">Assault 💥</option>
            <option value="Harassment">Harassment 😡</option>
            <option value="Vandalism">Vandalism 🧨</option>
            <option value="Other">Other ❓</option>
          </select>
        </div>

        <div className="overflow-auto max-h-[calc(100vh-12rem)]">
          <div className="grid gap-8">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/60 transition-all duration-300 border border-white/30 shadow-lg text-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block px-4 py-1 rounded-full text-base font-bold mb-3 ${
                      report.crimeType === "Theft"
                        ? "bg-yellow-400/90 text-yellow-900"
                        : report.crimeType === "Assault"
                        ? "bg-red-400/90 text-red-900"
                        : report.crimeType === "Harassment"
                        ? "bg-pink-400/90 text-pink-900"
                        : report.crimeType === "Vandalism"
                        ? "bg-blue-400/90 text-blue-900"
                        : "bg-gray-400/90 text-gray-900"
                    }`}>
                      {report.crimeType} {report.crimeType === "Theft" ? "🕵️‍♀️" : report.crimeType === "Assault" ? "💥" : report.crimeType === "Harassment" ? "😡" : report.crimeType === "Vandalism" ? "🧨" : "❓"}
                    </span>
                    <p className="text-white font-semibold mb-2 text-lg">{report.description} 📝</p>
                    <p className="text-white/90 text-base mb-1">{report.locationName} 📍</p>
                  </div>
                  <span className="text-xs text-white/80">
                    {new Date(report.timestamp).toLocaleString()} 🕒
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Lat: {report.latitude.toFixed(4)}, Long: {report.longitude.toFixed(4)} 🌎</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 