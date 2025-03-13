import React from 'react'
import Navbar from '../components/Navbar'
import { APP_NAME } from '../constants'

type Props = {}

export default function Landing({}: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navigation Bar*/}
            <Navbar isLoggedIn={false} />

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-center">
                    <h1 style = {{ color: "var(--primary-color)"}} className="text-5xl font-bold mb-4">{APP_NAME}</h1>
                    <h2 className="text-2xl text-gray-600 mb-8">Find Your Dream Job</h2>
                    <p className="text-gray-700 mb-8">
                        Keeping track of your job applications can be overwhelming. Jobby simplifies the process by helping you manage applications, deadlines, and interview schedules all in one place. Stay organized and stay ahead in your job search with our easy-to-use tracking system.
                    </p>
                    <button
                        className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline get-started-button active-button"
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
    )
}