import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Sample user data
const initialUsers = [
  {
    userId: 1,
    username: "john_doe",
    email: "john@example.com",
    dateOfJoin: "2024-01-12",
    role: "Admin",
    authorization: "Full",
    lastLogin: "2025-05-25",
    loginAttempts: 1,
    remarks: "Active user",
  },
  {
    userId: 2,
    username: "jane_smith",
    email: "jane@example.com",
    dateOfJoin: "2023-07-18",
    role: "Editor",
    authorization: "Limited",
    lastLogin: "2025-05-28",
    loginAttempts: 3,
    remarks: "Locked out",
  },
  // Add more users as needed
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // const [users, setUsers] = useState(initialUsers);

  const [users] = useState(initialUsers);

  const navigate = useNavigate();
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by username..."
        className="w-full sm:w-1/2 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Responsive table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100 text-sm text-left">
            <tr>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Date of Join</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Authorization</th>
              <th className="p-2 border">Last Login</th>
              <th className="p-2 border">Login Attempts</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId} className="text-sm hover:bg-gray-50">
                  <td className="p-2 border">{user.userId}</td>
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.dateOfJoin}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">{user.authorization}</td>
                  <td className="p-2 border">{user.lastLogin}</td>
                  <td className="p-2 border">{user.loginAttempts}</td>
                  <td className="p-2 border">{user.remarks}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => navigate(`/admin/edituser/${user.userId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
