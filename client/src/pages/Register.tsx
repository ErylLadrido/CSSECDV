import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router';

type Props = {}

export default function Register({}: Props) {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    
    let navigate = useNavigate();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            setProfilePhoto(event.target.files[0])
        }
    }
    
    const signUp = () => {
        const formData = new FormData();
    
        // Append form data
        formData.append('lastName', lastName);
        formData.append('firstName', firstName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phoneNumber', phoneNumber);

        // Check if profilePhoto is not null before appending it to the formData
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        } else {
            console.log('No profile photo selected');
        }
    
        // Send the request with the correct headers
        axios.post('http://localhost:8080/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // This tells the server the request contains multipart data
            }
        })
        .then(function (response) {
            console.log(response);
            alert(response.data.message);
            navigate("/login")
            
        })
        .catch(function (error) {
            console.log(error);

    // Check if error response exists
    if (error.response && error.response.data) {
        console.log(error);

        // Check if error.response exists
        if (error.response && error.response.data) {
            let errorMessage = '';
    
            // Case 1: If there is an image validation error (like file type or size)
            if (error.response.data.error && typeof error.response.data.error === 'string') {
                errorMessage = error.response.data.error; // Direct error message for image
            } 
            // Case 2: General validation errors (e.g., missing fields, email format, etc.)
            else if (typeof error.response.data.error === 'object') {
                // Loop through the error object and format key-value pairs
                for (const [key, value] of Object.entries(error.response.data.error || {})) {
                    errorMessage += `${key}: ${value}\n`;
                }
            }
            
            // If no error message was set by the above conditions, provide a fallback message
            if (!errorMessage) {
                errorMessage = "An unexpected error occurred.";
                setErrorMessage(errorMessage);
            }
    
            //alert(errorMessage);  // Show the error message in the alert box
            setErrorMessage(errorMessage);  // Set the error message in the state
        } else {
            //alert("An unexpected error occurred.");
            setErrorMessage("An unexpected error occurred.");
        }
    } else {
        //alert("An unexpected error occurred.");
        setErrorMessage("An unexpected error occurred.");
    }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>

                <form>
                    {/* Name Fields - Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="firstName"
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="lastName"
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Error Message */}
                    <p className="text-red-500 text-xs italic mb-4 min-h-[1rem]">
                        {errorMessage}
                    </p>

                    {/* Sign Up Button */}
                    <button
                        className="w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 transition register-button"
                        type="button"
                        onClick={signUp}
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
                <p className="text-center text-gray-500 text-xs mt-3">
                    &copy;2025 Jobby. Abenoja - Gonzales - Ladrido
                </p>
            </div>
        </div>

    )
}