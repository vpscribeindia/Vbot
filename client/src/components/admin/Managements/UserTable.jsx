// src/components/UserTable.jsx
import React from "react";
import UserTableRow from "./UserTableRow";

const UserTable = ({ users, onEdit, onDelete, onPassword }) => {
  return (
    <div className="overflow-x-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Specialty</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Praction</th>

              <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user, index) => (
              <UserTableRow
                key={user.id}
                user={user}
                index={index}
                handleEdit={() => onEdit(user)}
                handlePassword={() => onPassword(user.id)}
                handleDelete={() => onDelete(user.id)}
                isFirst={index === 0}
                isLast={index === users.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;