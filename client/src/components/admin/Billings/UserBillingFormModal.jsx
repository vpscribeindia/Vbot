import React from 'react'
  // Updatemodal
  export const EditBillingUserModal = ({
    uname,
    uemail,
    uamount,
    upstatus,
    uptype,
    upsdate,
    upedate,
    ulimit,
    ustatus,
    onChangeName,
    onChangeEmail,
    onChangeAmount,
    onChangePaymentStatus,
    onChangePackageType,
    onChangePackageStart,
    onChangePackageEnd,
    onChangeLimit,
    onChangeStatus,
    onCancel,
    onSubmit
  }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Billing User</h3>
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
            placeholder="Amount"
            className="w-full p-2 border rounded"
            value={uamount}
            onChange={onChangeAmount}
            required
          />
<select
  className="w-full p-2 border rounded"
  value={upstatus}
  onChange={onChangePaymentStatus}
  required
>
  <option value="">Select Payment Status</option>
  <option value="pending">Pending</option>
  <option value="paid">Paid</option>
  <option value="failed">Failed</option>

</select>
<select
  className="w-full p-2 border rounded"
  value={uptype}
  onChange={onChangePackageType}
  required
>
  <option value="">Select Package Type</option>
  <option value="trial">Trial</option>
  <option value="basic">Basic</option>
  <option value="standard">Standard</option>
  <option value="premium">Premium</option>

</select>
                    <input
            type="datetime-local"
            placeholder="Package Start Date"
            className="w-full p-2 border rounded"
            value={upsdate}
            onChange={onChangePackageStart}
            required
          />
                    <input
            type="datetime-local"
            placeholder="Package End Date"
            className="w-full p-2 border rounded"
            value={upedate}
            onChange={onChangePackageEnd}
            required
          />
                    <input
            type="number"
            placeholder="Usage Limit"
            className="w-full p-2 border rounded"
            value={ulimit}
            readOnly
            required
          />
<select
  className="w-full p-2 border rounded"
  value={ustatus}
  onChange={onChangeStatus}
  required
>
  <option value="">Select Status</option>
  <option value="active">Active</option>
  <option value="expired">Expired</option>
  <option value="cancelled">Cancelled</option>
</select>
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
