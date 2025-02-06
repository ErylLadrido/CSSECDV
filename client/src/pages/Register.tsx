import React from 'react'

type Props = {}

export default function Register({}: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>

                <form>
                    {/* Name Fields - Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="lastName"
                                type="text"
                                placeholder="Last Name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="firstName"
                                type="text"
                                placeholder="First Name"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="email"
                            type="email"
                            placeholder="Email"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                            Phone Number
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="phoneNumber"
                            type="tel"
                            placeholder="Phone Number"
                        />
                    </div>

                    {/* Profile Photo Upload */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePhoto">
                            Profile Photo
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-700 cursor-pointer"
                            id="profilePhoto"
                            type="file"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        className="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 transition register-button"
                        type="button"
                    >
                        Sign Up
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <a style={{ color: "var(--secondary-color)" }}
                            className="font-bold" href="/login">
                            Log in
                        </a>
                    </p>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    &copy;2025 Jobby. Abenoja - Gonzales - Ladrido
                </p>
            </div>
        </div>

    )
}