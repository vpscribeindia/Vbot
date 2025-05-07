import React ,{useState,useEffect} from 'react'
import UserBillingTable from "./UserBillingTable";
import axios from 'axios';
import {EditBillingUserModal}  from "./UserBillingFormModal";
import moment from 'moment';
import { toast } from "react-toastify";


const UserBilling = () => {
  const [billingusers, setBillingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [uemail, setuEmail] = useState('');
  const [uname, setuName] = useState('');
  const [uamount, setuAmount] = useState('');
  const [upstatus, setuPaymentStatus] = useState('');
  const [uptype, setuPackageType] = useState('');
  const [upsdate, setuPackageStart] = useState('');
  const [upedate, setuPackageEnd] = useState('');
  const [ulimit, setuLimit] = useState('');
  const [ustatus, setuStatus] = useState('');
  
  const onChangePackageType = (e) => {
    const selectedType = e.target.value;
    setuPackageType(selectedType);

    let limit = '';
    switch (selectedType) {
      case 'basic':
        limit = 10200;
        break;
      case 'standard':
        limit = 30000;
        break;
      case 'premium':
        limit = 99999;
        break;
      default:
        limit = 0;
    }

    setuLimit(limit);
  };


  const fetchBillingUsers = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:3000/api/getUserBilling",{
        withCredentials: true
      })
      
      .then((res) => {

        setBillingUsers(res.data); 
      })
   
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError("Could not load users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBillingUsers();
  }, []);

  const handleUpdate = async(e)=>{
    e.preventDefault()
    try{
     await axios.put(`http://localhost:3000/api/updateUserBilling`,
      {id:editModal,amount:uamount,payment_status:upstatus,status:ustatus,package_type:uptype,package_end_date:upedate,package_start_date:upsdate,usage_limit:ulimit,email:uemail,display_name:uname },
      { withCredentials: true}
    );
    
    fetchBillingUsers();
    toast.success("Billing User Updated Successfully")
    setEditModal(null)
    }
    catch{
      toast.error("Failed to update")
    }
      }
  return (
    <div className="p-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Billings</h2>

        <div className="flex items-center gap-4">
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 italic">Loading Billing data...</p>
      ) : error ? (
        <p className="text-red-500 italic">{error}</p>
      ) : billingusers.length === 0 ? (
        <p className="text-gray-500 italic">No billing data found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-4">
          <UserBillingTable
            billingusers={billingusers}
            onEdit={(billingusers) => {
              setuName(billingusers.User.Userinfo.display_name);  
              setuEmail(billingusers.User.email);
              setuAmount(billingusers.amount);
              setuPaymentStatus(billingusers.payment_status);
              setuPackageType(billingusers.pakage_type);
              setuPackageStart(billingusers.package_start_date.slice(0, 16).replace(' ', 'T'));
              setuPackageEnd(billingusers.package_end_date.slice(0, 16).replace(' ', 'T'));              
              setuLimit(billingusers.usage_limit);
              setuStatus(billingusers.status);
              setEditModal(billingusers.user_id);  
            }}
          />
        </div>
      )}



{/* Editmodal props */}

{editModal && (
  <EditBillingUserModal
    uname={uname}
    uemail={uemail}
    uamount={uamount}
    upstatus={upstatus}
    uptype={uptype}
    upsdate={upsdate}
    upedate={upedate}
    ulimit={ulimit}
    ustatus={ustatus}
    onChangeName={(e) => setuName(e.target.value)}
    onChangeEmail={(e) => setuEmail(e.target.value)}
    onChangeAmount={(e) => setuAmount(e.target.value)}
    onChangePaymentStatus={(e) => setuPaymentStatus(e.target.value)}
    onChangePackageType={onChangePackageType}
    onChangePackageStart={(e) => setuPackageStart(e.target.value)}
    onChangePackageEnd={(e) => setuPackageEnd(e.target.value)}
    onChangeLimit={(e) => setuLimit(e.target.value)}
    onChangeStatus={(e) => setuStatus(e.target.value)}
    onCancel={() => setEditModal(null)}
    onSubmit={handleUpdate}
  />
)}
    </div>
  );
}

export default UserBilling