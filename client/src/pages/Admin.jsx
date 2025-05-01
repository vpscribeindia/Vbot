// src/App.jsx
import { useState } from 'react';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import UserManagement from '../components/admin/UserManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState("users");

  return (
    <>
      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          setView={setView}
          activeView={view}
        />

        {/* Main Content */}
        <div
          className={`transition-all duration-300 w-full ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Header />

          <main className="p-6">
            {view === "users" && <UserManagement />}
            {view === "dashboard" && (
              <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
            )}
          </main>
        </div>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default Admin;
