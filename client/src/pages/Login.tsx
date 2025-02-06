import React from 'react'

type Props = {}

export default function Login({}: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

                {/* Form */}
                <form>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        className="w-full text-white font-semibold py-2 rounded-lg transition shadow-md login-button active-button"
                        type="submit"
                    >
                        Login
                    </button>

                    {/* Links */}
                    <div className="flex flex-col items-center mt-4 space-y-2">
                        <a style={{ color: "var(--secondary-color)" }}
                            className="text-blue-500 text-sm hover:underline" href="#">
                            Forgot Password?
                        </a>
                        <a style={{ color: "var(--secondary-color)" }}
                            className="text-blue-500 text-sm hover:underline" href="/register">
                            Don't have an account? <span className="font-semibold">Register</span>
                        </a>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                &copy; 2025 Jobby. Abenoja - Gonzales - Ladrido
                </p>
            </div>
        </div>

    )
}