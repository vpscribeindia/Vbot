// src/components/UserFormModal.jsx
import React, { useState, useEffect } from "react";

const UserFormModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    photo: "",
  });

  useEffect(() => {
    if (user) {
      const { email, username, role, photo } = user;
      const name = user.Userinfo?.display_name || user.name || "";
      setForm({ name, email, username, role, photo });
    }
  }, [user]);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleCancel = () => {
    setForm({
      name: "",
      email: "",
      username: "",
      role: "",
      photo: "",
    });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {user ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          {/* <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full p-2 border rounded"
            value={form.role}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="photo"
            placeholder="Photo URL (optional)"
            className="w-full p-2 border rounded"
            value={form.photo}
            onChange={handleChange}
          /> */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
