import React from 'react'
import moment from 'moment';

const UserLogTableRow = ({
  user,
}) => {
  return (
    <tr className="border-t">
      <td className="px-6 py-2">{moment.parseZone(user.date).format('YYYY-MM-DD HH:mm:ss')}</td>
      <td className="px-6 py-2">{user.User.Userinfo.display_name}</td>
      <td className="px-6 py-2">{user.User.email}</td>
      <td className="px-6 py-2">{user.User.role}</td>
      <td className="px-6 py-2">{user.activity}</td>
    </tr>
  );
};


export default UserLogTableRow
