import React from "react";
import {
  FaEdit,
  FaKey,
  FaTrash,
} from "react-icons/fa";

const UserTableRow = ({
  user,
  handleEdit,
  handlePassword,
  handleDelete,
}) => {
  return (
    <tr className="border-t">

      <td className="px-6 py-2">{user.Userinfo.display_name}</td>
      <td className="px-6 py-2">{user.email}</td>
      <td className="px-6 py-2">{user.Userinfo.specialty}</td>
      <td className="px-6 py-2">{user.Userinfo.role}</td>
      <td className="px-6 py-2">{user.Userinfo.praction}</td>

      <td className="px-4 py-2 space-x-2 text-center">
        <button onClick={() => handleEdit(user)} className="cursor-pointer">
          <FaEdit className="inline text-yellow-500" />
        </button>
        <button
          onClick={() =>{ 
            if(user.auth_provider == "local"){
              handlePassword(user.id)}}
            }
            disabled={user.auth_provider == "google"}
        >
          <FaKey
  className={`cursor-pointer inline ${
    user.auth_provider === "local" ? "text-indigo-500" : "text-gray-400"
  }`}/>
        </button>
        <button onClick={() => handleDelete(user.id)} className="cursor-pointer">
          <FaTrash className="inline text-red-500" />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
