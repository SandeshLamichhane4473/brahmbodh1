import React, { useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc,getDoc,setDoc } from "firebase/firestore";
import { NavLink } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';



const EditUser = () => {
  const { userId } = useParams(); // Get userId from URL
  const [editUser, seteditUser] = useState({
  name: "",
  email: "",
  uid: "",
  photoURL: "",
  createdAt: "",
  role: "user",
  authorization: "N",
});

  const [loading, setLoading] = useState(true);
 
  const { user} = useAuth();
  const canUpdate = user?.authorization?.includes("U");
  // Simulated user fetch function (replace with real API call)
  const fetchUserById = async (id) => {
    // Simulated data, ideally you'd fetch from an API using `id`
    
    try{
       const userRef = doc(db, "users", id); // 'users' is the collection name
       const userSnap = await getDoc(userRef);
      
       if (userSnap.exists()) {
          seteditUser(userSnap.data());
        } else {
         alert("No such user!");
        }
      } catch (error) {
        alert("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
 
  };

  useEffect(() => {
    const loadUser = async () => {
    await fetchUserById(userId);
    };
    loadUser();
  }, [userId]);

  const handleChange = (e) => {

    const { name, value } = e.target;
 
    seteditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {


    e.preventDefault();
    //make the validation rule:
     if (!/^[UABN]*$/.test(editUser.authorization)) {
      alert("Authorization field can only contain the letters U, A, N,B.");
      return; 
      }
       
     if(user.uid===editUser.uid){alert("Own id cannot be updated"); return;}
     if (!canUpdate) {
     alert("❌ You are not authorized to perform this action.");
     return;
      }
     setLoading(true)
     const userRef = doc(db, "users", editUser.uid);
     await setDoc(userRef, editUser, { merge: true });
     setLoading(false)

    // navigate("/admin/users");
    // Add your API update logic here
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">User not found.</div>;

  return (
    <div className=" mx-auto mt-10 bg-white p-6 rounded shadow">
 
      <h2 className="text-xl font-semibold mb-4">Edit User - ID # {user.authorization}
        
        <NavLink
          className="text-primary"
          to="/admin/users"
                  >
                     Go Back
                  </NavLink>
         </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">User ID</label>
          <input
            type="text"
            name="userId"
            value={editUser.uid}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={editUser.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={editUser.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date of Join</label>
          <input
            type="text"
            name="dateOfJoin"
            value={editUser.createdAt}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={editUser.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="blocked">Blocked</option>
     
          </select>
        </div>

    
     {/* UE  */}
        <div>
          <label className="block text-sm font-medium">Authorization</label>
          <input
            type="text"
            name="authorization"
            value={editUser.authorization}
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
