import React, {useState} from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import GoogleLogo from "../assets/google.png";
import Logo from "../assets/logo.png";
import WholeBG from "../assets/bg.png";
import SignBG from "../assets/leftimg.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Signup = () => {

    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const API_MAIN_URL = import.meta.env.VITE_API_URL;
    const validatePassword = (password) => {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    };
    const handleGoogleLogin = () => {
      window.location.href = `${API_MAIN_URL}/auth/google`;
    
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!email || !password || !confirmPassword) {
        toast.error("All fields are required.");
        return;
      }
  
      if (!validatePassword(password)) {
        toast.error(
          "Password must be at least 8 characters long include one lowercase letter, one uppercase letter, one number, and one special character."
        );
        return;
      }
  
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
  
      try {
        const response = await axios.post(`${API_MAIN_URL}/auth/signup`, {
          email,
          password,
        });
        toast.success(response.data.message || "Registration successful!");
        navigate("/onboarding");
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "An error occurred.");
        } else {
          toast.error("An error occurred.");
        }
      }
    };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${WholeBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        py: 2,
        px: {xs:2, lg:20}
      }}
    >
      <Grid container>
        <Grid
          xs={12}
          md={7}
          boxShadow={1}
          sx={{
            borderRadius: { xs: 4, md: "16px 0 0 16px" },
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              boxShadow: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src={Logo} alt="VBot" width={100} />
          </Box>

          <Box
            sx={{
              p: 2,
              boxShadow: 0,
              textAlign: "center",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            SIGNUP
          </Box>
      <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ py: 1, textAlign: "center" }}>
            <FormControl>
              <TextField
                required
                label="Email"
                type="email"
                value={email || ''}
                onChange={(e) => setemail(e.target.value)}
                InputLabelProps={{
                  sx: {
                    "& .MuiFormLabel-asterisk": {
                      color: "#DC3545",
                    },
                  },
                }}
                sx={{
                  width: { xs: 300, sm: 400, md: 350 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0 5px 5px rgba(0, 0, 0, 0.3)",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Montserrat, sans-serif", 
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#666",
                  },
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ py: 1, textAlign: "center" }}>
            <FormControl>
              <TextField
                required
                label="Password"
                type="password"
                value={password || ''}
                onChange={(e)=>setPassword(e.target.value)}
                InputLabelProps={{
                  sx: {
                    "& .MuiFormLabel-asterisk": {
                      color: "#DC3545",
                    },
                  },
                }}
                sx={{
                  width: { xs: 300, sm: 400, md: 350 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0 5px 5px rgba(0, 0, 0, 0.3)",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Montserrat, sans-serif", 
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#666",
                  },
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ py: 1, textAlign: "center" }}>
            <FormControl>
              <TextField
                required
                label="Confirm Password"
                type="password"
                value={confirmPassword || ''}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                  sx: {
                    "& .MuiFormLabel-asterisk": {
                      color: "#DC3545",
                    },
                  },
                }}
                sx={{
                  width: { xs: 300, sm: 400, md: 350 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0 5px 5px rgba(0, 0, 0, 0.3)",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Montserrat, sans-serif", 
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#666",
                  },
                }}
              />
            </FormControl>
          </Box>

          <Box
            sx={{
              py: 1,
              px: 1,
              boxShadow: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FormGroup>
              <FormControlLabel
              required
                control={
                  <Checkbox
                    sx={{
                      "&.Mui-checked": {
                        color: "#000", // tick color when checked
                      },
                    }}
                  />
                }
                label="I agree to the terms of VBot privacy policy, terms of use."
              />
            </FormGroup>
          </Box>

          <Box sx={{ py: 1, boxShadow: 0, textAlign: "center" }}>
            <Button variant="contained" type="submit" size="small" sx={{ bgcolor: "grey",fontFamily: "Montserrat, sans-serif" }}>
              Create Account
            </Button>
          </Box>

          </Box>

          <Box
            sx={{
              py: 1,
              boxShadow: 0,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Button onClick={handleGoogleLogin}><img src={GoogleLogo} alt="Google" width={40} /></Button>
          </Box>

          <Box
            sx={{
              py: 1,
              boxShadow: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              fontSize: { xs: 12, sm: 14, md: 16 },
            }}
          >
            Already have an account ?
            <Button variant="contained" size="small" sx={{ bgcolor: "grey",fontFamily: "Montserrat, sans-serif" }} onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </Box>

          <Box sx={{ py: 1, boxShadow: 0, textAlign: "center", fontSize: 16 }}>
            Privacy Policy
          </Box>
        </Grid>
        <Grid
          xs={12}
          md={5}
          boxShadow={1}
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${SignBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            px: 4,
            py: 10,
            borderRadius: { xs: 4, md: "0 16px 16px 0" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            display:{xs:"none", md:"block"}
          }}
        >
          <Box
            sx={{
              pt: 15,
              textAlign: "start",
              boxShadow: 0,
              fontSize: 32,
              fontWeight: 500,
            }}
          >
            <Typography component="span" sx={{ fontSize: 50 }}>
              W
            </Typography>
            elcome to our Medical AI Transcription Service
          </Box>
          <Box
            sx={{
              pt: 15,
              textAlign: "start",
              boxShadow: 0,
              fontSize: 18,
            }}
          >
            Experience accurate and confidential transcription with our advanced
            Al technology. Simplifying medical records for better patient care
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Signup;
