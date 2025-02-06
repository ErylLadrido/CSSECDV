import React from 'react'
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
        <div className="min-h-screen flex justify-center bg-purple-200 p-5">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row">
                    
                    {/* Profile Sidebar */}
                    <div className="md:w-1/4 flex flex-col items-center border-r p-4">
                        <label htmlFor="profile-upload" className="cursor-pointer">
                            <img 
                                className="rounded-full w-36 mt-5 border-2 border-gray-300 hover:border-purple-500 transition duration-200" 
                                src={defaulPFP}
                                alt="Profile" 
                            />
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
                    <div className="md:w-3/4 p-4">
                        <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Last Name" className="border p-2 rounded" />
                            <input type="text" placeholder="First Name" className="border p-2 rounded" />
                            <input type="text" placeholder="Email" className="border p-2 rounded" />              
                            <input type="text" placeholder="Phone Number" className="border p-2 rounded" />
                        </div>
                        <div className="mt-5 text-center">
                            <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900">Save Profile</button>
                        </div>
                        <div className="mt-5 text-center">
                            <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900">Change Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}