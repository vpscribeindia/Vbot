import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, allowedStatus = "active" }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const API_MAIN_URL = import.meta.env.VITE_API_URL;

    axios
      .get(`${API_MAIN_URL}/auth/protected`, { withCredentials: true })
      .then((res) => {
        const userStatus = res.data.user?.status;
        const userRole = res.data.user?.role;
        const currentPath = location.pathname;
        const allowed = Array.isArray(allowedStatus)
          ? allowedStatus
          : [allowedStatus];

        // console.log("userStatus:", userStatus);
        // console.log("userRole:", userRole);
        // console.log("currentPath:", currentPath);
        // console.log("allowed:", allowed);

        if (!allowed.includes(userStatus)) {
          if (userStatus === "inactive") return navigate("/onboarding");
          else return navigate("/login");
        }
if (currentPath === "/") {
  if (userRole === "admin") return navigate("/admin");
  return navigate("/dashboard");
}

// If a normal user tries to access /admin, block it
if (userRole !== "admin" && currentPath.startsWith("/admin")) {
  return navigate("/dashboard");
}


        setIsAllowed(true); 
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [allowedStatus, navigate, location.pathname]);

  if (loading) return <div>Loading...</div>;
  if (!isAllowed) return null;

  console.log("Rendering children");
  return children;
}


export default ProtectedRoute;
