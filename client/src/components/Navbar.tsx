import React from 'react'
import { useState } from 'react'
import { getCurrentDateTime } from '../helpers/dateTime'
import { APP_NAME } from '../constants'
import defaultPFP from '../assets/defaultPFP.jpg'

type Props = { username: string }

export default function Navbar({ username }: Props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    return (
        <nav style={{ backgroundColor: "var(--background-color)" }} className="text-white p-4 flex justify-between items-center shadow-md">
            <div style={{ color: "var(--primary-color)" }} className="text-xl font-bold">
                {APP_NAME}
            </div>
    
            <div className="flex items-center space-x-4">
                <div style={{ color: "var(--text-color)" }} className="text-sm">
                    {getCurrentDateTime()}
                </div>
        
                <div className="relative">
                    <button onClick={toggleDropdown} className="flex items-center space-x-2 p-2 rounded-full focus:outline-none drop-down-profile-button">
                        <img src={defaultPFP} // Default PFP should be stored in the database
                            alt="User profile"
                            className="w-8 h-8 rounded-full"
                        />
                
                        <span>{username}</span>
                    </button>
        
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Profile</a>
                            <a href="/tutorials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Tutorials</a>
                            <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
