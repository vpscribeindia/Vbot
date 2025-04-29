import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import DefaultRoute from "./pages/DefaultRoute";
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./pages/ProtectedRoute";
import OnboardingUI from "./pages/Onboarding";

import './App.css'
import Admin from "./pages/Admin";
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/onboarding" element={<OnboardingUI />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>

          }
        />

      </Routes>
    </Router>
  );
}

export default App;
