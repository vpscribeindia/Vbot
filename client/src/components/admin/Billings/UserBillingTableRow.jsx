import React from 'react'
import moment from 'moment';

const UserBillingTableRow = ({user}) => {
  return (
   <tr className="border-t">
   
         <td className="px-4 py-2">{user.User.Userinfo.display_name}</td>
         <td className="px-4 py-2">{user.User.email}</td>
         <td className="px-4 py-2">{user.amount}</td>
         <td className="px-4 py-2">{user.payment_status}</td>
         <td className="px-4 py-2">{user.pakage_type}</td>
         <td className="px-4 py-2">{moment.utc(user.package_start_date).local().format('YYYY-MM-DD HH:mm:ss')}</td>
         <td className="px-4 py-2">{moment.utc(user.package_end_date).local().format('YYYY-MM-DD HH:mm:ss')}</td>
         <td className="px-4 py-2">{user.usage_limit}</td>
         <td className="px-4 py-2">{user.status}</td>


   
         {/* <td className="px-4 py-2 space-x-2 text-center">
           <button onClick={() => handleEdit(user)} className="cursor-pointer">
             <FaEdit className="inline text-yellow-500" />
           </button>
           <button
             onClick={() =>{ 
               if(user.auth_provider == "local"){
                 handlePassword(user.id)}}
               }
               disabled={user.auth_provider == "google"}
           >
             <FaKey
     className={`cursor-pointer inline ${
       user.auth_provider === "local" ? "text-indigo-500" : "text-gray-400"
     }`}/>
           </button>
           <button onClick={() => handleDelete(user.id)} className="cursor-pointer">
             <FaTrash className="inline text-red-500" />
           </button>
         </td> */}
       </tr>
  )
}

export default UserBillingTableRow