import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const DefaultRoute = () => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState("/login");

  useEffect(() => {
    const API_MAIN_URL=import.meta.env.VITE_API_URL;

    // Send a request to check if the token is valid, but we rely on cookies.
    axios
      .get(`${API_MAIN_URL}/auth/protected`, { withCredentials: true }) // Important: `withCredentials: true` ensures the cookie is sent
      .then(() => {
        setRedirectTo("/dashboard");
      })
      .catch(() => {
        setRedirectTo("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Navigate to={redirectTo} replace />;
};

export default DefaultRoute;