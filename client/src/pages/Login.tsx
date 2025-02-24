import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'

type Props = {}

export default function Login({}: Props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    let navigate = useNavigate()

    const login = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        
        axios.post('http://localhost:8080/login', {cemail: email, password: password })
            .then(function (response) {
                alert(JSON.stringify(response.data.message)); // Show server response
            
                console.log(response.data.token);  
                console.log(response)

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role)

                if(email == "admin@admin.com"){
                    localStorage.setItem('role', 'admin');
                }

                if(localStorage.getItem('role') == "user")
                    navigate("/userpanel")
                else if(localStorage.getItem('role') == "admin")
                    navigate("/admin")

                setErrorMessage(""); // Clear error message if Login succeeds

            })
            .catch(function (error) {
                if (error.response) {
                    //alert(error.response.data.error); // Show server error message
                    setErrorMessage(error.response.data.error || "Invalid email or password");
                } else {
                    //alert(error.message);
                    setErrorMessage("An error occurred. Please try again.");
                }
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

                {/* Form */}
                <form onSubmit={login}>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Error Message */}
                    <p className="text-red-500 text-xs italic mb-4 min-h-[1rem]">
                        {errorMessage}
                    </p>

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