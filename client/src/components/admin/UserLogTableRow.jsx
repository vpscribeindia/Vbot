import React from 'react'
const UserLogTableRow = ({
  user,
}) => {
  return (
    <tr className="border-t">
      <td className="px-4 py-2"></td>
      <td className="px-4 py-2">{user.Userinfo.display_name}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2"></td>
    </tr>
  );
};


export default UserLogTableRow
