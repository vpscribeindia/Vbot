import React ,{useState,useEffect} from 'react'
import UserBillingTable from "./UserBillingTable";
import axios from 'axios';
const UserBilling = () => {
  const [billingusers, setBillingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordModal, setPasswordModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [praction, setPraction] = useState('');
  const [uemail, setuEmail] = useState('');
  const [uname, setuName] = useState('');
  const [urole, setuRole] = useState('');
  const [uspecialty, setuSpecialty] = useState('');
  const [upraction, setuPraction] = useState('');



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


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Billings</h2>

        <div className="flex items-center gap-4">

          {/* <button
            onClick={() => {
              setAddModal(true);}}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition cursor-pointer"
          >
            <FaPlus />
            Add User
          </button> */}
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

          />
        </div>
      )}

    </div>
  );
}

export default UserBilling