import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
// Sample user data

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // const [users, setUsers] = useState(initialUsers);
   const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const filteredUsers = users.filter((user) =>

   user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => doc.data());
        
        setUsers(usersData);
      } catch (error) {
         alert('Error fetching users:', error);
         console.log(error)
      }
    };
//useeffect
useEffect(() => {
    fetchUsers();
  }, []);


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
            <tr key="abc">
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
                <tr key={user.uid} className="text-sm hover:bg-gray-50">
                  <td className="p-2 border">{user.uid}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.createdAt}</td>
                  <td className="p-2 border">{user.role && user.role}</td>
                  <td className="p-2 border">{user.authorization}</td>
                  <td className="p-2 border">{user.lastLogin}</td>
                  <td className="p-2 border">{user.loginAttempts}</td>
                  <td className="p-2 border">{user.remarks}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => navigate(`/admin/edituser/${user.uid}`)}
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
