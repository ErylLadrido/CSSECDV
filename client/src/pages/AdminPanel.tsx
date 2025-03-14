import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ConfirmActionModal from '../components/ConfirmActionModal';
import { set } from 'zod';

type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  isblocked: number;
};

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentAdminPage, setCurrentAdminPage] = useState(1);
  const usersPerPage = 50;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve stored token

    axios
      .get("http://localhost:8080/adminpanel/users", {
        headers: {
          Authorization: `Bearer ${token}`, // token in request
        },
      })
      .then((response) => {
        console.log("API Response Users:", response.data.users);
        setUsers(response.data.users);
      })
      .catch((error) => {
        alert(`Error: ${error.response?.status} - ${error.response?.data?.message}`);
        console.error("API Error:", error.response);
      });
  }, []);

  const handleExportUserList = () => {
    alert('Export User List functionality to be implemented.');
  };

  const handleBlockUser = (email: string) => {
    if (!selectedUser) {
      // alert('User not found.');
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve stored token

    axios.put(`http://localhost:8080/adminpanel/blockuser/${email}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // alert(`User with email ${email} has been blocked.`);
      // setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      setSelectedUser(null);
      setShowBlockModal(false);
    })
    .catch((error) => {
      alert(`Error: ${error.response?.status} - ${error.response?.data?.message}`);
      console.error("API Error:", error.response);
    });
  };

  const handleToggleBlock = (email: string, isBlocked: number) => {
    const newStatus = isBlocked === 1 ? 0 : 1; // Toggle status
    const action = newStatus === 1 ? "blockuser" : "unblockuser";

    axios
      .put(`http://localhost:8080/adminpanel/${action}/${email}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email ? { ...user, isblocked: newStatus } : user
          )
        );
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
      });
  };


  // const handleDeleteUser = (email: string) => {
  //   alert(`Delete user with email: ${email}`);
  // };

  // Corrected Pagination Logic
  const indexOfLastUser = currentAdminPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  // Handle pagination safely
  const handleNextPage = () => {
    if (currentAdminPage < totalPages) {
      setCurrentAdminPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentAdminPage > 1) {
      setCurrentAdminPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <button
            onClick={handleExportUserList}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Export User List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Lastname</th>
                <th className="px-4 py-2 text-left">Firstname</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.last_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.first_name}</div>
                    </td>
                    <td className={`px-6 py-4 ${user.isblocked ? "text-orange-600 font-semibold" : "text-green-600"}`}>
                      {user.isblocked ? "Blocked" : "Active"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button
                      onClick={() => handleToggleBlock(user.email, user.isblocked)}
                      className={`px-4 py-2 rounded ${
                        user.isblocked
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-orange-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {user.isblocked ? "Unblock" : "Block"}
                    </button>
                      {/* <button
                        onClick={() => handleDeleteUser(user.email)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fixed Pagination (Now outside the table) */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            disabled={currentAdminPage === 1}
            onClick={handlePreviousPage}
            className={`px-4 py-2 rounded ${currentAdminPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentAdminPage} of {totalPages}
          </span>
          <button
            disabled={currentAdminPage >= totalPages}
            onClick={handleNextPage}
            className={`px-4 py-2 rounded ${currentAdminPage >= totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Next
          </button>
        </div>

        {selectedUser && showBlockModal && (
          <ConfirmActionModal
            message={`Are you sure you want to block user with email: ${selectedUser.email}?`}
            onClose={() => setSelectedUser(null)}
            onConfirm={() => handleBlockUser(selectedUser.email)}
          />
        )}
      </div>
    </div>
  );
}
