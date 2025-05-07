
import React , { useEffect, useRef }  from "react";
import UserBillingTableRow from "./UserBillingTableRow";
import $ from 'jquery';
import 'datatables.net-dt';
const UserBillingTable = ({ billingusers,onEdit }) => {

  const tableRef = useRef();

  useEffect(() => {
    const $table = $(tableRef.current);

    const dataTable = $table.DataTable({
      destroy: true,
      responsive: true,
      dom: '<"flex justify-between items-center mb-2"lf>rt<"flex justify-between items-center mt-2"ip>',
      language: {
        search: "🔍 Search:",
        lengthMenu: "Show _MENU_ billing users per page",
        info: "Showing _START_ to _END_ of _TOTAL_ billing users",
        paginate: {
          next: "➡️",
          previous: "⬅️"
        },
        zeroRecords: "No matching billing users found",
      }
    });
    


    return () => {
      dataTable.destroy();
    };
  }, [billingusers]);
  return (
    <div className="overflow-x-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 p-4">
      <table ref={tableRef} className="min-w-full divide-y divide-gray-200 display">
        
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
            <tr>
              <th className="px-1 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-1 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-1 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-1 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Status</th>
              <th className="px-1 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Package Type</th>

              <th className="px-1 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Package Start date</th>
              <th className="px-1 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Package End date</th>
              <th className="px-1 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Usage Limit</th>
              <th className="px-1 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-1 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>


            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {billingusers.map((billinguser, index) => (
              <UserBillingTableRow
                key={billinguser.id}
                user={billinguser}
                index={index}
                handleEdit={() => onEdit(billinguser)}
                isFirst={index === 0}
                isLast={index === billinguser.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserBillingTable;