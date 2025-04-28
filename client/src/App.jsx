import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
// import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
import DefaultRoute from "./pages/DefaultRoute";
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Router>
               <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
      <Routes>
  
        {/* Default Route */}
        <Route path="/" element={<DefaultRoute />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
