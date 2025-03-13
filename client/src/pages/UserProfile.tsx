import React from 'react'
import Navbar from '../components/Navbar';
import defaulPFP from '../assets/defaultPFP.jpg'

type Props = {}

export default function UserProfile({}: Props) {

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const dataURL = canvas.toDataURL();
                        console.log(dataURL);
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            
            {/* Navigation Bar*/}
            <Navbar isLoggedIn={true} />
            
            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-col md:flex-row">
                        
                        {/* Profile Sidebar */}
                        <div className="w-full md:w-1/4 flex flex-col items-center p-4 border-b md:border-b-0 md:border-r">
                            {/* Profile Photo with Hover Effect */}
                            <label htmlFor="profile-upload" className="cursor-pointer group relative">
                                <img 
                                    className="rounded-full w-36 mt-5 border-2 border-gray-300 transition duration-200 pfp-bg-hover" 
                                    src={defaulPFP}
                                    alt="Profile" 
                                />
                                {/* Change Photo Text */}
                                <div 
                                    style={{ backgroundColor: "var(--secondary-color)" }}
                                    className="absolute bottom-0 left-0 right-0 bg-opacity-50 text-white text-center text-sm py-1 opacity-0 group-hover:opacity-100 transition duration-300 rounded">
                                    Change Photo
                                </div>
                            </label>
                            <input 
                                id="profile-upload" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageUpload} 
                            />
                            <h3 className="font-bold mt-3">Sample User</h3>
                            <p className="text-gray-500">sampleuser@mail.com</p>
                        </div>

                        {/* Profile Form */}
                        <div className="w-full md:w-3/4 p-4">
                            <h2 style={{ color: "var(--secondary-color)" }} className="text-xl font-bold mb-4">Profile Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Last Name" className="border p-2 rounded w-full" />
                                <input type="text" placeholder="First Name" className="border p-2 rounded w-full" />
                                <input type="text" placeholder="Email" className="border p-2 rounded w-full" />              
                                <input type="text" placeholder="Phone Number" className="border p-2 rounded w-full" />
                            </div>

                            {/* Buttons Side by Side */}
                            <div className="mt-5 flex flex-col md:flex-row gap-4">
                                <button className="flex-1 text-white px-4 py-2 rounded save-profile-button active-button">
                                    Save Profile
                                </button>
                                <button className="flex-1 text-white px-4 py-2 rounded change-password-button active-button">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}