import React from "react";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";

const UserCard = ({ user, onEdit, onDelete, onPassword }) => {
  const initials = user.name
    ?.trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition-shadow min-w-[300px] max-w-[360px] w-full">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-4 overflow-hidden">
        {user.photo ? (
          <img
            src={user.photo}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-400 flex items-center justify-center text-white text-xl font-bold">
            {initials || "?"}
          </div>
        )}

        {/* User Details */}
        <div className="overflow-hidden">
          <h3 className="font-semibold text-lg truncate">{user.name}</h3>
          <p className="text-sm text-gray-600 truncate">{user.email}</p>
          <p className="text-sm font-medium text-blue-600 mt-1 truncate">
            {user.role}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 text-lg text-gray-500 shrink-0 ml-4">
        <button
          onClick={() => onEdit(user)}
          className="hover:text-yellow-500"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onPassword(user.id)}
          className="hover:text-indigo-500"
          title="Change Password"
        >
          <FaKey />
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="hover:text-red-500"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
