import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;  // Basic validation for 10 digit phone number
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing again
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Client-side validation
    if (!validatePhone(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/auth/register", form);
      // Check if the response indicates success (either through message or userId presence)
      if (response.data.message?.includes('success') || response.data.userId) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      // Enhanced error handling
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message ||
                          "Registration failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Glassmorphism Card */}
      <div className="relative z-10 max-w-md w-full bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2 drop-shadow">Create Your Account</h1>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Register</h2>
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
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 w-full">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Registration successful! Redirecting to login...</p>
              </div>
            </div>
          </div>
        )}
        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" /></svg>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-8 0v2" /></svg>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10a9 9 0 0118 0c0 7-9 13-9 13S3 17 3 10z" /></svg>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="\d{10}"
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                placeholder="Phone Number (10 digits)"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center bg-white/60 rounded-lg px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400">
              <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-4a4 4 0 100-8 4 4 0 000 8z" /></svg>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="bg-transparent outline-none w-full text-gray-900 placeholder-gray-400"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={success}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold shadow-md hover:from-purple-700 hover:to-pink-700 transition-colors duration-200 ${success ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {success ? 'Registration Successful!' : 'Register'}
          </button>
        </form>
        <div className="flex items-center my-4 w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="mt-4 text-center w-full">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-pink-600 hover:text-pink-800 font-medium"
          >
            Already have an account? Sign in
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
