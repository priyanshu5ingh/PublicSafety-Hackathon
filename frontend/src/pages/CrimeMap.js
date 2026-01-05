import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from "axios";
import { MapPinIcon, ExclamationTriangleIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons for different crime types
const crimeIcons = {
  Theft: new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/svgs/solid/circle-dollar-to-slot.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  }),
  Assault: new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/svgs/solid/hand-fist.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  }),
  Burglary: new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/svgs/solid/house-crack.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  }),
  Vandalism: new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/svgs/solid/spray-can.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  }),
  Fraud: new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/svgs/solid/user-secret.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  }),
  Other: new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/svgs/solid/location-dot.svg',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41]
  })
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

// Add this CSS at the top of the file after imports
const scrollbarStyles = `
  /* For Webkit browsers like Chrome/Safari */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
`;

export default function CrimeMap() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total: 0,
    byType: {},
    recentReports: []
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/crime");
        setReports(res.data);
        
        // Calculate statistics
        const stats = {
          total: res.data.length,
          byType: {},
          recentReports: [...res.data]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
        };
        
        res.data.forEach(report => {
          stats.byType[report.crimeType] = (stats.byType[report.crimeType] || 0) + 1;
        });
        
        setStatistics(stats);
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

  const safetyTips = [
    "Stay aware of your surroundings at all times",
    "Keep your valuables secure and out of sight",
    "Walk in well-lit areas during night time",
    "Save emergency contact numbers on speed dial",
    "Travel in groups when possible",
    "Share your location with trusted contacts",
    "Report suspicious activities immediately",
    "Keep your doors and windows locked"
  ];

  const crimeMarkings = [
    { type: "Theft", color: "yellow", description: "Incidents of theft and robbery" },
    { type: "Assault", color: "red", description: "Physical assault cases" },
    { type: "Burglary", color: "orange", description: "Break-ins and burglaries" },
    { type: "Vandalism", color: "blue", description: "Property damage and vandalism" },
    { type: "Fraud", color: "green", description: "Scams and fraudulent activities" },
    { type: "Other", color: "violet", description: "Other reported incidents" }
  ];

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600">
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading crime reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {/* Main Map Section - Takes up 3 columns */}
            <div className="col-span-3 bg-white/30 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Crime Map</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" className="bg-indigo-900 text-white">All Types</option>
                  <option value="Theft" className="bg-indigo-900 text-white">Theft</option>
                  <option value="Assault" className="bg-indigo-900 text-white">Assault</option>
                  <option value="Burglary" className="bg-indigo-900 text-white">Burglary</option>
                  <option value="Vandalism" className="bg-indigo-900 text-white">Vandalism</option>
                  <option value="Fraud" className="bg-indigo-900 text-white">Fraud</option>
                  <option value="Other" className="bg-indigo-900 text-white">Other</option>
                </select>
              </div>

              <div className="h-[calc(100vh-8rem)] rounded-lg overflow-hidden">
                <MapContainer
                  center={center}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredReports.map((report) => (
                    <Marker
                      key={report.id}
                      position={[report.latitude, report.longitude]}
                      icon={crimeIcons[report.crimeType] || crimeIcons.Other}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-lg mb-2">{report.crimeType}</h3>
                          <p className="text-sm mb-2">{report.description}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(report.timestamp).toLocaleString()}
                          </p>
                          {report.evidence_images && report.evidence_images.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-semibold mb-1">Evidence:</p>
                              <div className="grid grid-cols-2 gap-1">
                                {report.evidence_images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={`http://localhost:5001/api/crime/evidence/${image}`}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Right Side Panel - Takes up 1 column */}
            <div className="col-span-1 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
              {/* Crime Statistics */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  Crime Statistics
                </h3>
                <div className="space-y-3">
                  <div className="text-white">
                    <p className="text-sm font-medium">Total Reports</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">By Type:</p>
                    {Object.entries(statistics.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-white/90 text-sm">
                        <span>{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Recent Reports:</p>
                    {statistics.recentReports.map((report, index) => (
                      <div key={index} className="text-white/90 text-sm p-2 bg-white/10 rounded">
                        <p className="font-medium">{report.crimeType}</p>
                        <p className="text-xs truncate">{report.description}</p>
                        <p className="text-xs opacity-75">
                          {new Date(report.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Crime Markings Legend */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Crime Markings
                </h3>
                <div className="space-y-3">
                  {crimeMarkings.map((crime) => (
                    <div key={crime.type} className="flex items-start gap-2">
                      <div className={`w-6 h-6 rounded-full bg-${crime.color}-500 flex-shrink-0 mt-1`}></div>
                      <div>
                        <p className="text-white font-medium">{crime.type}</p>
                        <p className="text-white/80 text-sm">{crime.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  Safety Tips
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {safetyTips.map((tip, index) => (
                    <li key={index} className="text-white text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
