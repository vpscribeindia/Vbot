import React, { useState, useEffect } from "react";
import RobotLogo from "../../assets/Logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BillingPopup from "../Bill";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const API_MAIN_URL = import.meta.env.VITE_API_URL;

const Header = ({ variant }) => {
  const navigate = useNavigate();
  const baseClasses = "shadow";
  const bgClass =
    variant === "admin"
      ? "bg-white dark:bg-gray-900"
      : "bg-white dark:bg-gray-500";

  const [openDialog, setOpenDialog] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userrole, setUserrole] = useState("");
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    specialty: "",
    role: "",
    parction: "",
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    specialty: "",
    parction: "",
  });

  const handleLogout = async () => {
    await axios.get(`${API_MAIN_URL}/auth/logout`, { withCredentials: true });
    toast.error("Logged out Successfully!");
    navigate("/login");
  };

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/api/usersId", { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setUser({
          name: data.display_name,
          email: data.User.email,
          role: data.role || "",
          specialty: data.specialty || "",
          parction: data.praction || "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  };

  const fetchRole = () => {
    axios
      .get("http://localhost:3000/api/usersId", { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setUserrole(data.User.role||"");
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchRole();
  }, []);

  const handleOpenDialog = () => {
    setEditUser({
      name: user.name,
      email: user.email,
      specialty: user.specialty,
      role: user.role,
      parction: user.parction,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3000/api/updateProfileUsers", editUser, {
        withCredentials: true,
      });
      console.log(editUser);
      
      toast.success("Profile updated successfully!");
      fetchUsers();
      setOpenDialog(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <nav className={`${baseClasses} ${bgClass}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={RobotLogo} alt="Logo" className="h-10" />
          <span className="text-2xl font-semibold dark:text-white">VBOT AI</span>
        </div>

        {/* User Avatar & Dropdown */}
        <div
      className="relative"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <button
        type="button"
        className="w-10 h-10 bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 flex items-center justify-center overflow-hidden cursor-pointer"
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

      <div
        className={`absolute right-0 z-50 mt-2 w-48 bg-white rounded-lg shadow-md dark:bg-gray-700 transition-all duration-200 ${
          showDropdown ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* 👇 CLICKABLE NAME/EMAIL */}
        <div
          className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
          onClick={handleOpenDialog}
        >
          <span className="block text-sm text-gray-900 dark:text-white">
            {user.name}
          </span>
          <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
            {user.email}
          </span>
        </div>

        {userrole === "user" ? <BillingPopup /> : " "}
        <ul className="py-2">
          <li>
            <a
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              onClick={handleLogout}
            >
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
      </div>

      {/* UPDATE PROFILE DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={editUser.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={editUser.email}
            onChange={handleInputChange}
            fullWidth
          />

          {/* Specialty dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Specialty</InputLabel>
            <Select
              name="specialty"
              value={editUser.specialty}
              label="Specialty"
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Select Specialty</em></MenuItem>
              <MenuItem value="Cardiology">Cardiology</MenuItem>
              <MenuItem value="Neurology">Neurology</MenuItem>
              <MenuItem value="Orthopedics">Orthopedics</MenuItem>
              <MenuItem value="Dermatology">Dermatology</MenuItem>
              <MenuItem value="Pediatrics">Pediatrics</MenuItem>
            </Select>
          </FormControl>

          {/* Role dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={editUser.role}
              label="Role"
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Select Role</em></MenuItem>
              <MenuItem value="Physician">Physician</MenuItem>
              <MenuItem value="Nurse Practitioner">Nurse Practitioner</MenuItem>
              <MenuItem value="Physician Assistant">Physician Assistant</MenuItem>
              <MenuItem value="Resident">Resident</MenuItem>
              <MenuItem value="Medical Student">Medical Student</MenuItem>
            </Select>
          </FormControl>

          {/* Parction dropdown */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Clinicians work in practice</InputLabel>
            <Select
              name="parction"
              value={editUser.parction}
              label="Clinicians work in practice"
              onChange={handleInputChange}
            >
              <MenuItem value=""><em>Select number</em></MenuItem>
              <MenuItem value="1-5">1-5</MenuItem>
              <MenuItem value="6-10">6-10</MenuItem>
              <MenuItem value="11-20">11-20</MenuItem>
              <MenuItem value="21-50">21-50</MenuItem>
              <MenuItem value="50+">50+</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default Header;
