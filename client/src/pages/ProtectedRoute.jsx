import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, allowedStatus = "active" }) => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const API_MAIN_URL = import.meta.env.VITE_API_URL;

    axios
      .get(`${API_MAIN_URL}/auth/protected`, { withCredentials: true })
      .then((res) => {
        const userStatus = res.data.user?.status;

        // Normalize allowedStatus to array
        const allowed = Array.isArray(allowedStatus)
          ? allowedStatus
          : [allowedStatus];

        if (allowed.includes(userStatus)) {
          setRedirectTo(null); 
        } else if (userStatus === "inactive") {
          setRedirectTo("/onboarding");
        } else if (userStatus === "active") {
          setRedirectTo("/dashboard");
        } else {
          setRedirectTo("/login");
        }
      })
      .catch(() => {
        setRedirectTo("/login");
      })
      .finally(() => setLoading(false));
  }, [allowedStatus]);

  if (loading) return <div>Loading...</div>;
  if (redirectTo) return <Navigate to={redirectTo} replace />;
  return children;
};

export default ProtectedRoute;
