import React, { useEffect, useState, } from "react";
import { useNavigate,useParams } from "react-router-dom";


const EditUser = () => {
  const { userId } = useParams(); // Get userId from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Simulated user fetch function (replace with real API call)
  const fetchUserById = async (id) => {
    // Simulated data, ideally you'd fetch from an API using `id`
    const userData = {
      2: {
        userId: 2,
        username: "jane_smith",
        email: "jane@example.com",
        dateOfJoin: "2023-07-18",
        role: "Editor",
        status: "Active",
        authorization: "Limited",
        lastLogin: "2025-05-28",
        loginAttempts: 3,
        remarks: "Locked out",
      },
      // Add more mock users if needed
    };
    return userData[id];
  };

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUserById(userId);
      setUser(data);
      setLoading(false);
    };

    loadUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User:", user);
    alert("User updated successfully!");
    navigate("/admin/users");
    // Add your API update logic here
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">User not found.</div>;

  return (
    <div className=" mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit User - ID #{user.userId}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">User ID</label>
          <input
            type="text"
            name="userId"
            value={user.userId}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date of Join</label>
          <input
            type="text"
            name="dateOfJoin"
            value={user.dateOfJoin}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={user.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Authorization</label>
          <input
            type="text"
            name="authorization"
            value={user.authorization}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Login</label>
          <input
            type="date"
            name="lastLogin"
            value={user.lastLogin}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Login Attempts</label>
          <input
            type="number"
            name="loginAttempts"
            value={user.loginAttempts}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <textarea
            name="remarks"
            value={user.remarks}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-secondary h-11 mt-5 text-white px-4 py-2 rounded hover:bg-primary"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;
