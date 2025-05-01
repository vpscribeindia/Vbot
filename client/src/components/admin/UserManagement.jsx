// src/components/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import UserFormModal from "./UserFormModal";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:3000/api/users",{
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
    fetchUsers();
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

  const handlePassword = (id) => {
    alert(`Change password for user ID ${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

        <div className="flex items-center gap-4">

          {/* Add User Button */}
          <button
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
          >
            <FaPlus />
            Add User
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 italic">Loading users...</p>
      ) : error ? (
        <p className="text-red-500 italic">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500 italic">No users found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-4">
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteUserId(id)}
            onPassword={handlePassword}
          />
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => setDeleteUserId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
