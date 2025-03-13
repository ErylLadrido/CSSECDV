import React, { useState, useRef, useEffect } from "react";
import { getCurrentDateTime } from "../helpers/dateTime";
import { APP_NAME } from "../constants";
import defaultPFP from "../assets/defaultPFP.jpg";

type Profile = {
    first_name: string;
    last_name: string;
    profile_photo: string;
};

type Props = { 
    isLoggedIn: boolean;
};

export default function Navbar({ isLoggedIn }: Props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserProfile();
        }
    }, [isLoggedIn]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found in localStorage");
                return;
            }
    
            const response = await fetch("http://localhost:8080/userpanel/profiledata", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            console.log("Profile API Response:", data); // Debugging log
    
            if (response.ok && data.profile) {
                setProfile({
                    first_name: data.profile.first_name,  
                    last_name: data.profile.last_name, 
                    profile_photo: data.profile.profile_photo
                });
            } else {
                console.error("Failed to fetch profile:", data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    
    // Inside Navbar component:
    const formattedPhotoURL = profile?.profile_photo 
        ? `http://localhost:8080/${profile.profile_photo.replace(/\\/g, "/")}` 
        : defaultPFP;

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const logout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("token");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav style={{ backgroundColor: "var(--background-color)" }} className="text-white p-4 flex justify-between items-center shadow-md">
            <div style={{ color: "var(--primary-color)" }} className="text-xl font-bold">
                {APP_NAME}
            </div>

            <div className="flex items-center space-x-4">
            {isLoggedIn && profile ? (
                    <div className="flex items-center space-x-4">
                        <div style={{ color: "var(--text-color)" }} className="text-sm">{getCurrentDateTime()}</div>

                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={toggleDropdown} 
                                className="flex items-center space-x-2 p-2 rounded-full border border-gray-500 focus:outline-none hover:bg-gray-800 transition">
                                <img 
                                    src={formattedPhotoURL} 
                                    alt="User profile"
                                    className="w-8 h-8 rounded-full"
                                />
                                {/* Dropdown arrow */}
                                <svg style={{ color: "var(--text-color)" }} className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                                    <a href="/UserProfile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                                        <span style={{ color: "var(--text-color)" }} >{profile?.first_name} {profile?.last_name}</span>
                                    </a>
                                    <a href="/login" onClick={logout} style={{ color: "var(--text-color)" }} className="block px-4 py-2 text-sm hover:bg-gray-200">
                                        Logout
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        {/* Features
                        FAQs */}
                        <a href="/login" className="font-bold py-2 px-4 rounded login-button">Login</a>
                        <a href="/register" className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline register-button">Register</a>
                    </div>
                )}
            </div>
        </nav>
    );
}
