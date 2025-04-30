import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


import {
  Box,
  FormControl,
  TextField,
  Button,
  Typography,
  Link,

} from "@mui/material";
import Grid from "@mui/material/Grid";
import Google from "../assets/google.png";
import Logo from "../assets/Logo.png";
import leftimg from "../assets/leftimg.png";
import WholeBG from "../assets/bg.png";
axios.defaults.withCredentials = true;
const Login = () => {
const [email,setEmail] = useState("");
const [password,setPassword]  =useState("");
const navigate = useNavigate();
const API_MAIN_URL=import.meta.env.VITE_API_URL;

const handleGoogleLogin = () => {
  window.location.href = `${API_MAIN_URL}/auth/google`;

};

const handleSubmit= async (e)=>{
  e.preventDefault();
     if (!email || !password) {
        toast.error("Both fields are required.");
        return;
      }
  

  
      try {
        await axios.post(`${API_MAIN_URL}/auth/login`, {
        email,
        password,
      }); 
  
        toast.success("Login successful!");
        navigate("/dashboard");
      } catch (err) {
        toast.error("Invalid email or password.");
      }
  console.log('Form Data:', email,password);
  // setEmail("")
  // setPassword("")

}
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: { xs: "100%", lg: "100vw" },
        backgroundImage: `url(${WholeBG})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        px: {xs:2,lg:20}
      }}
    >
      <Grid container  sx={{ px: { xs: 0, xl: 20 } }}>
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={5}
          boxShadow={1}
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${leftimg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: { xs: 4, md: "16px 0 0 16px" },
            color: "#fff",
            px: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            display:{xs:"none", md:"block"},
          }}
        >
          <Box
            sx={{
              pt: 10,
              textAlign: "start",
              boxShadow: 0,
              fontSize: 32,
            }}
          >
            <Typography component="span" sx={{ fontSize: 50 }}>
              W
            </Typography>
            elcome to our Medical AI Transcription Service
          </Box>

          <Box
            sx={{
              pt: 8,
              textAlign: "start",
              boxShadow: 0,
              fontSize: 18,
              marginBottom: { xs: 5, lg: 0 },
            }}
          >
            Experience accurate and confidential transcription with our advanced
            Al technology. Simplifying medical records for better patient care
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={7}
          py={2}
          boxShadow={1}
          sx={{
            backgroundColor: "#fff",
            borderRadius: { xs: 4, lg: "0 16px 16px 0" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img src={Logo} alt="logo" width="80px" />
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
            LOGIN
          </Box>

          {/* Email Field */}
      <Box component="form" onSubmit={handleSubmit}>
          <Box  sx={{ py: 1, textAlign: "center" }}>
            <FormControl>
              <TextField
                required
                label="Email"
                name="email"
                type="email"
                value={email || ''}
                onChange={(e)=>setEmail(e.target.value)}
                InputLabelProps={{
                    sx: {
                      "& .MuiFormLabel-asterisk": {
                        color: "#DC3545",
                      },
                    },
                  }}
                sx={{
                  width: { xs: 250, sm: 400, md: 350 },
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
                    color: "#666",
                  },
                  
                }}
  
              />
            </FormControl>
          </Box>


          {/* Password Field with Show/Hide */}
          <Box sx={{ py: 1, textAlign: "center" }}>
            <FormControl>
              <TextField
                required
                label="Password"
                name="password"
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
                  width: { xs: 250, sm: 400, md: 350 },
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
                    color: "#666",
                  },
                }}

              />
            </FormControl>
          </Box>

          {/* Forget Password */}
          {/* <Box
            sx={{
              textAlign: "right",
              width: { xs: 250, sm: 400, md: 350 },
              mx: "auto",
              mb: 2
            }}
          >
            <Link
              sx={{ textDecoration: "none", cursor: "pointer", color: "#000" }}
            >
              Forgot Password?
            </Link>
          </Box> */}

          {/* Sign In Button */}
          <Box sx={{ py: 1, textAlign: "center" }}>
            <Button
              type="submit"
              size="small"
              variant="contained"
              sx={{ px: 8, backgroundColor: "grey", fontFamily: "Montserrat, sans-serif" }}
            >
              Sign In
            </Button>
          </Box>
          </Box>
          {/* Social Login */}
          <Box
            sx={{
              py: 1,
              boxShadow: 0,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Button
            onClick={handleGoogleLogin}
            ><img src={Google} alt="Google" width={40} /></Button>

          </Box>

          {/* Sign Up Prompt */}
          <Box sx={{ p: 2, textAlign: "center" }}>
            Don't have an account?
            <Button
              size="small"
              variant="contained"
              sx={{ backgroundColor: "grey", ml: 2, py: 0, fontFamily: "Montserrat, sans-serif" }}
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>

            <Button
              size="small"
              variant="contained"
              sx={{ backgroundColor: "grey", ml: 2, py: 0, fontFamily: "Montserrat, sans-serif" }}
              onClick={() => navigate('/admin')}
            >
              Admin
            </Button>
          </Box>

          {/* Privacy Policy */}
          <Box sx={{ textAlign: "center" }}>Privacy Policy</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
