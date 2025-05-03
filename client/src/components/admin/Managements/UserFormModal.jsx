// // src/components/UserFormModal.jsx
// import React, { useState, useEffect } from "react";

// const UserFormModal = ({ user, onClose, onSave }) => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     username: "",
//     role: "",
//     photo: "",
//   });

//   useEffect(() => {
//     if (user) {
//       const { email, username, role, photo } = user;
//       const name = user.Userinfo?.display_name || user.name || "";
//       setForm({ name, email, username, role, photo });
//     }
//   }, [user]);
  

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(form);
//   };

//   const handleCancel = () => {
//     setForm({
//       name: "",
//       email: "",
//       username: "",
//       role: "",
//       photo: "",
//     });
//     onClose();
//   };
  
//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">
//           {user ? "Edit User" : "Add User"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             className="w-full p-2 border rounded"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full p-2 border rounded"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="specialty"
//             placeholder="Specialty"
//             className="w-full p-2 border rounded"
//             value={form.username}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="role"
//             placeholder="Role"
//             className="w-full p-2 border rounded"
//             value={form.role}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="praction"
//             placeholder="Praction"
//             className="w-full p-2 border rounded"
//             value={form.photo}
//             onChange={handleChange}
//           />
//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-4 py-2 bg-gray-300 rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserFormModal;


import React from 'react'

// Addmodal
export const AddUserModal = ({
  name,
  email,
  specialty,
  role,
  praction,
  onChangeName,
  onChangeEmail,
  onChangeSpecialty,
  onChangeRole,
  onChangePraction,
  onCancel,
  onSubmit
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add User</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={onChangeName}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={onChangeEmail}
          required
        />
        <input
          type="text"
          placeholder="Specialty"
          className="w-full p-2 border rounded"
          value={specialty}
          onChange={onChangeSpecialty}
          required
        />
        <input
          type="text"
          placeholder="Role"
          className="w-full p-2 border rounded"
          value={role}
          onChange={onChangeRole}
          required
        />
        <input
          type="text"
          placeholder="Praction"
          className="w-full p-2 border rounded"
          value={praction}
          onChange={onChangePraction}
        />
        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Updatemodal
export const EditUserModal = ({
  uname,
  uemail,
  uspecialty,
  urole,
  upraction,
  onChangeName,
  onChangeEmail,
  onChangeSpecialty,
  onChangeRole,
  onChangePraction,
  onCancel,
  onSubmit
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit User</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={uname}
          onChange={onChangeName}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={uemail}
          onChange={onChangeEmail}
          required
        />
        <input
          type="text"
          placeholder="Specialty"
          className="w-full p-2 border rounded"
          value={uspecialty}
          onChange={onChangeSpecialty}
          required
        />
        <input
          type="text"
          placeholder="Role"
          className="w-full p-2 border rounded"
          value={urole}
          onChange={onChangeRole}
          required
        />
        <input
          type="text"
          placeholder="Praction"
          className="w-full p-2 border rounded"
          value={upraction}
          onChange={onChangePraction}
        />
        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
);

// passwordmodal
export const PasswordModal  = ( {
  password,
  confirmPassword,
  onChangePassword,
  onChangeConfirmPassword,
  onSubmit,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Change</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={onChangePassword}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          required
        />
        <div className="flex justify-center gap-4 mt-4">
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded cursor-pointer" type="submit">
            Change
          </button>
        </div>
      </form>
    </div>
  </div>
);


// Deletemodal  

export const DeleteModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
      <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this user?</p>
      <div className="flex justify-center gap-4">
        <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer" onClick={onCancel}>
          Cancel
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  </div>
);