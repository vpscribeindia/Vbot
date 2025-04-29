import React from "react";
import {
  FaEdit,
  FaKey,
  FaTrash,
} from "react-icons/fa";
import AvatarCircle from "./AvatarCircle";

const UserTableRow = ({
  user,
  handleEdit,
  handlePassword,
  handleDelete,
}) => {
  return (
    <tr className="border-t">
      <td className="px-4 py-2">
        <AvatarCircle name={user.name} photo={user.photo} />
      </td>
      <td className="px-4 py-2">{user.name}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">{user.role}</td>
      <td className="px-4 py-2 space-x-2 text-center">
        <button onClick={() => handleEdit(user.id)}>
          <FaEdit className="inline text-yellow-500" />
        </button>
        <button
          onClick={handlePassword}
          title="Change Password"
        >
          <FaKey className="inline text-indigo-500" />
        </button>
        <button onClick={() => handleDelete(user.id)}>
          <FaTrash className="inline text-red-500" />
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow;
