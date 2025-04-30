import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const DefaultRoute = () => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState("/login");

  useEffect(() => {
    const API_MAIN_URL = import.meta.env.VITE_API_URL;

    axios
      .get(`${API_MAIN_URL}/auth/protected`, { withCredentials: true })
      .then((res) => {
        const status = res.data.user?.status;

        if (status === "inactive") {
          setRedirectTo("/onboarding");
        } else if (status === "active") {
          setRedirectTo("/dashboard");
        } else {
          setRedirectTo("/login"); 
        }
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
