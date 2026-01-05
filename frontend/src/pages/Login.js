import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5001/auth/login", {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password
      });
      
      if (response.data.user) {
        login(response.data.user);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Glassmorphism Card */}
      <div className="relative z-10 max-w-md w-full bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2 drop-shadow">Welcome to Namma Suraksha</h1>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Login</h2>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 w-full">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" /></svg>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                required
                placeholder="Enter your email or username"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-8 0v2" /></svg>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                required
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox rounded text-pink-500 mr-2" />
              Remember me
            </label>
            <button type="button" className="text-pink-500 hover:underline">Forgot password?</button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold shadow-md hover:from-purple-700 hover:to-pink-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <div className="flex items-center my-4 w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center gap-4 w-full">
          <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 shadow hover:bg-white">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg>
          </button>
          <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 shadow hover:bg-white">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.18v3.954h5.273c-.228 1.22-1.37 3.584-5.273 3.584-3.176 0-5.76-2.626-5.76-5.86s2.584-5.86 5.76-5.86c1.81 0 3.02.77 3.72 1.43l2.54-2.47C17.14 3.62 15.24 2.5 12.625 2.5 7.98 2.5 4.25 6.23 4.25 10.87s3.73 8.37 8.375 8.37c4.82 0 8.005-3.39 8.005-8.17 0-.55-.06-1.08-.17-1.58z"/></svg>
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="text-pink-600 hover:text-pink-800 font-medium"
          >
            Create an account
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">Empowering safer communities, one report at a time.</p>
        </div>
      </div>
      {/* Optionally, add a blurred moon or landscape SVG as a background element for extra style */}
    </div>
  );
}