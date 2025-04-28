import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const Apiurl = process.env.REACT_APP_API_URL.slice(0, -15);
    const isTokenValid = (token) => {
      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        return Date.now() < exp * 1000;
      } catch {
        return false;
      }
    };
    if (!token || !isTokenValid(token)) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    axios
      .get(`${Apiurl}/auth/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
