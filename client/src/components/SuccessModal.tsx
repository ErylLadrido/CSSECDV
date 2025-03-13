import React from 'react'

interface SuccessfulModalProps {
    message: string;
    onClose: () => void;
}

export default function SuccessModal({ message, onClose }: SuccessfulModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">🎉 {message} 🎉 </h2>
                {/* <p className="text-gray-700 mb-4">Redirecting to your dashboard...</p> */}
                <button 
                    onClick={onClose} 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
