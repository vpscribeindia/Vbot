
import React from "react";
import UserBillingTableRow from "./UserBillingTableRow";

const UserBillingTable = ({ billingusers,onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 ">
        <table className="min-w-full divide-y divide-gray-200">
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