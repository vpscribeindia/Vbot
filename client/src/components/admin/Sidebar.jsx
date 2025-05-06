import React, { useState } from "react";
import {
  FaUsers,
  FaChevronDown,
  FaBars,
  FaChartLine, // import icon for Logging & Monitoring
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar, setView, activeView }) => {
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);

  const isUserMgmtActive =
    activeView === "users" || activeView === "usersbilling";

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
        <button onClick={toggleSidebar} className="text-white ml-2 cursor-pointer">
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <ul className="p-4 space-y-2 text-sm">
        {/* User Management */}
        <li className="group relative">
          <button
            onClick={handleUserMenuClick}
            className={`w-full flex items-center justify-between p-2 rounded transition relative cursor-pointer ${
              isUserMgmtActive
                ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
                : "hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              <FaUsers />
              {isOpen && <span>User Management</span>}
            </div>
            {isOpen && (
              <FaChevronDown
                className={`transition-transform ${
                  userMgmtOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* Flyout menu for collapsed sidebar */}
          {!isOpen && (
            <div
              className="absolute left-full top-0 ml-2 z-50 w-40 bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 hover:opacity-100 pointer-events-none group-hover:pointer-events-auto hover:pointer-events-auto transition duration-200 before:absolute before:top-0 before:-left-2 before:w-2 before:h-full"
            >
              <div className="text-xs font-semibold text-white px-3 py-2 border-b border-gray-600">
                User Management
              </div>
              <ul className="py-1 text-sm text-white">
                <li>
                  <button
                    onClick={() => setView("users")}
                    className={`block p-2 rounded w-full text-left transition-all cursor-pointer ${
                      activeView === "users"
                        ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
                        : "hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    User Info
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setView("usersbilling")}
                    className={`block p-2 rounded w-full text-left transition-all cursor-pointer ${
                      activeView === "usersbilling"
                        ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
                        : "hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    User Billings
                  </button>
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
                  className={`block p-2 rounded w-full text-left transition-all cursor-pointer ${
                    activeView === "users"
                      ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                    User Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView("usersbilling")}
                  className={`block p-2 rounded w-full text-left transition-all cursor-pointer ${
                    activeView === "usersbilling"
                      ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  User Billings
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* Logging and Monitoring */}
        <li className="relative group">
          <button
            onClick={() => setView("userslogging")}
            className={`w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition cursor-pointer ${
              activeView === "userslogging"
                ? "bg-blue-600 text-white border-l-4 border-blue-400 pl-3"
                : "text-gray-300"
            }`}
          >
            <FaChartLine />
            {isOpen && <span>Logging & Monitoring</span>}
          </button>

          {/* Tooltip when collapsed */}
          {!isOpen && (
            <div className="absolute left-full top-0 ml-2 z-50 w-max bg-gray-800 text-white text-sm rounded shadow-lg px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto hover:opacity-100 hover:pointer-events-auto transition duration-200">
              Logging & Monitoring
            </div>
          )}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
