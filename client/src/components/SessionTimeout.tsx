import React from 'react';
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router';

export default function SessionTimeout () {

  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('role'); // Remove the role
    navigate('/login'); // Redirect to the login page
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Session Expired</h1>

        <p className="text-gray-700 text-center mb-6">
          Your session has expired due to inactivity. Please log in again to continue.
        </p>

        <button
          onClick={handleRedirectToLogin}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
        >
          Return to Login
        </button>

        <p className="text-center text-gray-500 text-xs mt-6">
          &copy; 2025 Jobby. Abenoja - Gonzales - Ladrido
        </p>
      </div>
    </div>
  );
}
