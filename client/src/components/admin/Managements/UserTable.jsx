import React, { useEffect, useRef } from "react";
import UserTableRow from "./UserTableRow";
import $ from 'jquery';
import 'datatables.net-dt';

const UserTable = ({ users, onEdit, onDelete, onPassword }) => {
  const tableRef = useRef();

  useEffect(() => {
    const $table = $(tableRef.current);

    const dataTable = $table.DataTable({
      destroy: true,
      responsive: true,
      dom: '<"flex justify-between items-center mb-2"lf>rt<"flex justify-between items-center mt-2"ip>',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        search: "🔍 Search:",
        lengthMenu: "Show _MENU_ users per page",
        info: "Showing _START_ to _END_ of _TOTAL_ users",
        zeroRecords: "No matching users found",
      }
    });
    


    return () => {
      dataTable.destroy();
    };
  }, [users]);

  return (
    <div className="overflow-x-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4">
        <table ref={tableRef}  className="min-w-full divide-y divide-gray-200 display">         
             
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
            <tr>
              <th className="px-3 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-3 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-3 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Specialty</th>
              <th className="px-3 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-3 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Praction</th>
              <th className="px-3 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
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
