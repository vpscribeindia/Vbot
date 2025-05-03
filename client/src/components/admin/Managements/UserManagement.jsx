// src/components/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import {AddUserModal,EditUserModal,PasswordModal,DeleteModal}  from "./UserFormModal";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordModal, setPasswordModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [praction, setPraction] = useState('');
  const [uemail, setuEmail] = useState('');
  const [uname, setuName] = useState('');
  const [urole, setuRole] = useState('');
  const [uspecialty, setuSpecialty] = useState('');
  const [upraction, setuPraction] = useState('');



  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
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

  const handleDelete = async() => {
   await axios
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

  // const handleEdit = (user) => {
  //   setEditingUser(user);
  //   setModalOpen(true);
  // };

  // const handleSave = (formData) => {
  //   // Map formData.name to display_name for backend
  //   const payload = {
  //     id: editingUser?.id,
  //     email: formData.email,
  //     display_name: formData.name,
  //   };
  
  //   const request = editingUser
  //     ? axios.put(`http://localhost:3000/api/updateUsers`, payload, { withCredentials: true })
  //     : axios.post("http://localhost:3000/api/users", formData, { withCredentials: true });
  
  //   request
  //     .then(() => {
  //       fetchUsers();
  //       setModalOpen(false);
  //       setEditingUser(null);
  //       toast.success(editingUser ? "User Edited" : "User Added");
  //     })
  //     .catch(() => toast.error("Failed to save user."));
  // };
  

  const handlePassword = async (e) => {
e.preventDefault()
try{
if(password !== confirmPassword){
  toast.error('Password should match');
  setPassword('')
  setConfirmPassword('')
  return;
}
if (!validatePassword(password)) {
        toast.error(
          "Password must be at least 8 characters long include one lowercase letter, one uppercase letter, one number, and one special character."
        );
  setPassword('')
  setConfirmPassword('')
        return;
      }
 await axios.put(`http://localhost:3000/api/updatepassword`,
  { id: passwordModal,password:password },
        { withCredentials: true}
);
toast.success("Successfully Updated")
setPassword('')
setConfirmPassword('')
setPasswordModal(null)
}
catch{
  toast.error("Failed to update")
}
  };
  const handleUpdate = async(e)=>{
e.preventDefault()
try{
 await axios.put(`http://localhost:3000/api/updateUsers`,
  { id: editModal,display_name:uname,email:uemail,specialty:uspecialty,role:urole,praction:upraction },
  { withCredentials: true}
);
fetchUsers();
toast.success("User Updated Successfully")
setEditModal(null)
}
catch{
  toast.error("Failed to update")
}
  }
  const handleAdd = async(e)=>{
e.preventDefault()
try{
  await axios.post(`http://localhost:3000/api/addUsers`,
{name,specialty,role,praction,email},
{ withCredentials: true})
fetchUsers();
toast.success("User Added Successfully")
setEmail('')
setName('')
setRole('')
setSpecialty('')
setPraction('')

setAddModal(null)
}catch{
  toast.error("Failed to add")
}
  }
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

        <div className="flex items-center gap-4">

          {/* Add User Button */}
          <button
            onClick={() => {
              setAddModal(true);}}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition cursor-pointer"
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
            onEdit={(user) => {
              setuName(user.Userinfo.display_name);  
              setuEmail(user.email);
              setuSpecialty(user.Userinfo.specialty);
              setuRole(user.Userinfo.role);
              setuPraction(user.Userinfo.praction);
              setEditModal(user.id);  
            }}
            onDelete={(id) => setDeleteUserId(id)}
            onPassword={(id)=>setPasswordModal(id)}
          />
        </div>
      )}

      {/* AddModal Props */}
      
{addModal && (
  <AddUserModal
    name={name}
    email={email}
    specialty={specialty}
    role={role}
    praction={praction}
    onChangeName={(e) => setName(e.target.value)}
    onChangeEmail={(e) => setEmail(e.target.value)}
    onChangeSpecialty={(e) => setSpecialty(e.target.value)}
    onChangeRole={(e) => setRole(e.target.value)}
    onChangePraction={(e) => setPraction(e.target.value)}
    onCancel={() => setAddModal(null)}
    onSubmit={handleAdd}
  />
)}




{/* Editmodal props */}

{editModal && (
  <EditUserModal
    uname={uname}
    uemail={uemail}
    uspecialty={uspecialty}
    urole={urole}
    upraction={upraction}
    onChangeName={(e) => setuName(e.target.value)}
    onChangeEmail={(e) => setuEmail(e.target.value)}
    onChangeSpecialty={(e) => setuSpecialty(e.target.value)}
    onChangeRole={(e) => setuRole(e.target.value)}
    onChangePraction={(e) => setuPraction(e.target.value)}
    onCancel={() => setEditModal(null)}
    onSubmit={handleUpdate}
  />
)}


{/* deletemodal props */}

{deleteUserId && (
  <DeleteModal
    onCancel={() => setDeleteUserId(null)}
    onConfirm={handleDelete}
  />
)}
    
    {/* passwordchange props */}

    {passwordModal && (
  <PasswordModal
    password={password}
    confirmPassword={confirmPassword}
    onChangePassword={(e) => setPassword(e.target.value)}
    onChangeConfirmPassword={(e) => setConfirmPassword(e.target.value)}
    onCancel={() => setPasswordModal(null)}
    onSubmit={handlePassword}
  />
)}

      {/* Modal */}
      {/* {modalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )} */}

      {/* Delete Confirmation Modal */}
      {/* {deleteUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer"
                onClick={() => setDeleteUserId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}

        {/* password change Modal */}
            {/* {passwordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Change</h3>

            <div className="flex justify-center gap-4">
            <form onSubmit={handlePassword} className="space-y-4">
          <input
            type="password"
            name="pass"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            name="cpass"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded me-3 cursor-pointer"
                onClick={() => setPasswordModal(null)}
              >
                Cancel
              </button>
              <button
              type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"

              >
                Change
              </button>
              </form>
            </div>
          </div>
        </div>
      )} */}





                  {/* Edit user Modal */}
                  {/* {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit User</h3>

            <div className="flex justify-center gap-4">
            <form onSubmit={handleUpdate} className="space-y-4">
            <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={uname}
            onChange={(e)=>setuName(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={uemail}
            onChange={(e)=>setuEmail(e.target.value)}
            required
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specialty"
            className="w-full p-2 border rounded"
            value={uspecialty}
            onChange={(e)=>setuSpecialty(e.target.value)}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full p-2 border rounded"
            value={urole}
            onChange={(e)=>setuRole(e.target.value)}
            required
          />
          <input
            type="text"
            name="praction"
            placeholder="Praction"
            className="w-full p-2 border rounded"
            value={upraction}
            onChange={(e)=>setuPraction(e.target.value)}
          />
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded me-3 cursor-pointer"
                onClick={() => setEditModal(null)}
              >
                Cancel
              </button>
              <button
              type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Update
              </button>
              </form>
            </div>
          </div>
        </div>
      )} */}


                        {/* Add user Modal */}
                        {/* {addModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add User</h3>

            <div className="flex justify-center gap-4">
            <form onSubmit={handleAdd} className="space-y-4">
            <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specialty"
            className="w-full p-2 border rounded"
            value={specialty}
            onChange={(e)=>setSpecialty(e.target.value)}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            className="w-full p-2 border rounded"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            required
          />
          <input
            type="text"
            name="praction"
            placeholder="Praction"
            className="w-full p-2 border rounded"
            value={praction}
            onChange={(e)=>setPraction(e.target.value)}
          />
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded me-3 cursor-pointer"
                onClick={() => setAddModal(null)}
              >
                Cancel
              </button>
              <button
              type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Add
              </button>
              </form>
            </div>
          </div>
        </div>
      )} */}

    </div>
  );
};

export default UserManagement;
