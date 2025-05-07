import React , { useEffect, useRef } from 'react'
import UserLogTableRow from './UserLogTableRow';
import $ from 'jquery';
import 'datatables.net-dt';

const UserLogTable = ({users}) => {
    const tableRef = useRef();
  
  useEffect(() => {
    const $table = $(tableRef.current);

    const dataTable = $table.DataTable({
      destroy: true,
      responsive: true,
      dom: '<"flex justify-between items-center mb-2"lf>rt<"flex justify-between items-center mt-2"ip>',
      language: {
        search: "🔍 Search:",
        lengthMenu: "Show _MENU_ per page",
        info: "Showing _START_ to _END_ of _TOTAL_ data",
        paginate: {
          next: "➡️",
          previous: "⬅️"
        },
        zeroRecords: "No matching data found",
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user, index) => (
                  <UserLogTableRow
                    key={user.id}
                    user={user}
                    index={index}
                    // handleEdit={() => onEdit(user)}
                    // handlePassword={() => alert(`Change password for user ID ${user.id}`)}
                    // handleDelete={() => onDelete(user.id)}
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
    

export default UserLogTable