import React, { useEffect, useState } from "react";

import axios from "axios";
// import UserFormModal from "./UserFormModal";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import UserLogTable from "./UserLogTable";

const UserLogging = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchLoggingUsers = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:3000/api/getLogging",{
        withCredentials: true
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError("Could not load users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLoggingUsers();
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3000/api/deleteUsers`,{
        data: { id: deleteUserId },
        
      },{ withCredentials: true}
    )

      .then(() => {
        fetchUsers();
        toast.error("User Deleted");
      })
      .catch(() => toast.error("Failed to delete user."))
      .finally(() => setDeleteUserId(null));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = (formData) => {
    const request = editingUser
      ? axios.put(`http://localhost:3000/api/updateUsers/${editingUser.id}`, formData)
      : axios.post("http://localhost:3000/api/users", formData);

    request
      .then(() => {
        fetchUsers();
        setModalOpen(false);
        setEditingUser(null);
        toast.success(editingUser ? "User Edited" : "User Added");
      })
      .catch(() => showError("Failed to save user."));
  };



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Logging & Monitoring</h2>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 italic">Loading data...</p>
      ) : error ? (
        <p className="text-red-500 italic">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 italic">No data found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-4">
          <UserLogTable
            users={users}
          />
        </div>
      )}
    </div>
  );
};
export default UserLogging