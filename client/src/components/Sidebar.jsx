import React, { useState } from "react";
import {
  FaUsers,
  FaChevronDown,
  FaBars,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar, setView, activeView}) => {
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);

  const handleUserMenuClick = () => {
    setUserMgmtOpen(!userMgmtOpen);
  };

  return (
    <aside
      className={`h-screen bg-gray-800 text-white shadow-md transition-all duration-300 fixed top-0 left-0 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        {isOpen && (
          <span className="text-2xl font-semibold">
            <span className="text-blue-400">Admin</span> Panel
          </span>
        )}
        <button onClick={toggleSidebar} className="text-white ml-2">
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <ul className="p-4 space-y-2 text-sm">
        {/* User Management */}
        <li className="group relative">
  <button
    onClick={handleUserMenuClick}
    className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-700 transition"
  >
    <div className="flex items-center space-x-3">
      <FaUsers />
      {isOpen && <span>User Management</span>}
    </div>
    {isOpen && (
      <FaChevronDown
        className={`transition-transform ${userMgmtOpen ? "rotate-180" : ""}`}
      />
    )}
  </button>

  {/* Hover tooltip + submenu for collapsed view */}
  {!isOpen && (
    <div className="absolute left-full top-0 ml-2 z-50 w-40 bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-200">
      <div className="text-xs font-semibold text-white px-3 py-2 border-b border-gray-600">
        User Management
      </div>
      <ul className="py-1 text-sm text-white">
        <li>
        <button
          onClick={() => setView("users")}
          className={`block p-2 rounded w-full text-left transition-all ${
            activeView === "users"
              ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
              : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          Users
        </button>
        </li>
        <li>
          <button
            onClick={() => alert("Roles clicked")}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Roles
          </button>
        </li>
        <li>
          {/* <button
            onClick={() => alert("Permissions clicked")}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Permissions
          </button> */}
        </li>
      </ul>
    </div>
  )}

  {/* Expanded submenu when sidebar is open */}
  {userMgmtOpen && isOpen && (
    <ul className="pl-10 mt-2 space-y-1 text-gray-300">
      <li>
      <button
          onClick={() => setView("users")}
          className={`block p-2 rounded w-full text-left transition-all ${
            activeView === "users"
              ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
              : "hover:bg-gray-700 text-gray-300"
          }`}
        >
          Users
        </button>
      </li>
      <li>
        <button
          onClick={() => alert("Roles clicked")}
          className="block p-2 rounded hover:bg-gray-700 w-full text-left"
        >
          Roles
        </button>
      </li>
      <li>
        {/* <button
          onClick={() => alert("Permissions clicked")}
          className="block p-2 rounded hover:bg-gray-700 w-full text-left"
        >
          Permissions
        </button> */}
      </li>
    </ul>
  )}
</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
