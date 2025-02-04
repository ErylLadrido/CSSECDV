import React from 'react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md w-full">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-lg font-bold text-gray-800">Jobby</div>
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                type="button"
              >
                Log In
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                type="button"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Jobby</h1>
          <h2 className="text-2xl text-gray-600 mb-8">Find Your Dream Job</h2>
          <p className="text-gray-700 mb-8">
            Keeping track of your job applications can be overwhelming. Jobby simplifies the process by helping you manage applications, deadlines, and interview schedules all in one place. Stay organized and stay ahead in your job search with our easy-to-use tracking system.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center py-4 bg-white shadow-md">
        <p className="text-gray-500 text-xs">
        &copy;2025 Jobby. Abenoja - Gonzales - Ladrido
        </p>
      </div>
    </div>
  );
};

export default Landing;