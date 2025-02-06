import React from 'react'

type Props = {}

export default function Login({}: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        placeholder="Email"
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                        </label>
                        <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        >
                        Sign In
                        </button>
                        <a
                        className="inline-block align-baseline font-bold text-xs text-blue-500 hover:text-blue-800"
                        href="#"
                        >
                        Forgot Password?
            
                        </a>
                        <a
                        className="inline-block align-baseline font-bold text-xs text-blue-500 hover:text-blue-800"
                        href="#"
                        >
                        Don't have an account? Sign up.
            
                        </a>
                    </div>
                </form>

                <p className="text-center text-gray-500 text-xs mt-6">
                &copy;2025 Jobby. Abenoja - Gonzales - Ladrido
                </p>
            </div>
        </div>
    )
}