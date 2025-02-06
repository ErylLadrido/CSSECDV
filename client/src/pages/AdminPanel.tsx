import React from 'react'
import Navbar from '../components/Navbar'

type Props = {}

export default function AdminPanel({}: Props) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="Admin" isLoggedIn={true} />

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">User</th>
                                <th className="px-4 py-2 text-left">Role</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">User</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Promote</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">Jane Doe</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">User</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Promote</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}