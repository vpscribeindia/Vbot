import React, { useState } from "react";
import RobotLogo from "../assets/Logo.png";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Replace this with dynamic data if needed
  const user = {
    name: "Santhosh Kumar",
    email: "sample@gmail.com",
    photo: "", // Leave empty to test fallback
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 shadow">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={RobotLogo}
            alt="Logo"
            className="h-10"
          />
          <span className="text-2xl font-semibold dark:text-white">
            VBOT AI
          </span>
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 flex items-center justify-center overflow-hidden"
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold uppercase">
                {user.name
                  ?.split(" ")  
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </span>
            )}
          </button>


          {dropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-lg shadow-md dark:bg-gray-700">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
