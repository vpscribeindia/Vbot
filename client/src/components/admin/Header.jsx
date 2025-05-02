import React, { useState,useEffect} from "react";
import RobotLogo from "../../assets/Logo.png";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import BillingPopup from '../Bill';


const API_MAIN_URL=import.meta.env.VITE_API_URL;
const Header = ({variant}) => {

  const navigate = useNavigate();
  const baseClasses = "shadow";
  const bgClass =
  variant === "admin"
      ? "bg-white dark:bg-gray-900"
      : "bg-white dark:bg-gray-500";

  const handleLogout = async () => {
    await axios.get(`${API_MAIN_URL}/auth/logout`,{
      withCredentials: true
    });
    toast.error('Logged out Successfully!');
    navigate('/login');
  };
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const fetchUsers = () => {
axios
  .get("http://localhost:3000/api/usersId", { withCredentials: true })
  .then((res) => {
    const data = res.data;
    setUser({
      name: data.display_name,
      email: data.User.email,
    });
  })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  };
  // ✅ call fetchUsers when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <nav className={`${baseClasses} ${bgClass}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={RobotLogo}
            alt="Logo"
            className="h-10"
          />
          <span className="text-2xl font-semibold  dark:text-white">
            VBOT AI
          </span>
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="w-10 h-10 bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 flex items-center justify-center overflow-hidden cursor-pointer" 
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold uppercase" >
                {user.name
                  ?.split(" ")  
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </span>
            )}
          </button>


   
            <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-lg shadow-md dark:bg-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <BillingPopup />
              <ul className="py-2">
                <li>
                  <a
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={handleLogout} >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
 
        </div>
      </div>
    </nav>
  );
};

export default Header;
