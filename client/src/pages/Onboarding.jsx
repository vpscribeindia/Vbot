import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Typography,
  Button,
  Link,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Logo from "../assets/logo.png";
import OnBoard from "../assets/onboard.png";
import OnBoardGalaxy from "../assets/onboardgalaxy.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Email,
  Phone,
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";
import WholeBG from "../assets/bg.png";

const steps = [
  "Welcome",
  "Name",
  "Specialty",
  "Role",
  "Practice",
  "Create Note",
];

const OnboardingUI = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [role, setRole] = useState("");
  const [clinicianCount, setClinicianCount] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_MAIN_URL = import.meta.env.VITE_API_URL;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    if (validateStep()) {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = () => {
    let tempErrors = {};

    if (activeStep === 1 && !name.trim()) {
      tempErrors.name = "Name is required";
    }
    if (activeStep === 2 && !specialty) {
      tempErrors.specialty = "Specialty is required";
    }
    if (activeStep === 3 && !role) {
      tempErrors.role = "Role is required";
    }
    if (activeStep === 4 && !clinicianCount) {
      tempErrors.clinicianCount = "Clinician count is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      const response = await axios.post(`${API_MAIN_URL}/api/createQuestion`, {
        display_name: name,
        specialty,
        role,
        praction: clinicianCount,
      }, {
        withCredentials: true,
      });
      console.log(name,specialty,role,clinicianCount);
      toast.success(response.data.message || "Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("An error occurred.");
      }
    }
  };

  
  const handleLogout = async () => {
    await axios.get(`${API_MAIN_URL}/auth/logout`);
    toast.error('Logged out Successfully!');
    navigate('/login');
  };


  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Typography>
            Congrats on taking the first step towards freeing your time. In a
            few moments, you'll have created your first note, customized it to
            your style, and copied it into your EHR. Ready? Press "Next" and
            let's create your first note together. Thank you for being a
            clinician.
          </Typography>
        );
      case 1:
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography fontWeight={500} textAlign="center">
              Sign notes with your name
            </Typography>
            <Box
              component="input"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                const inputValue = e.target.value;
                const onlyLetters = inputValue.replace(/[^a-zA-Z\s]/g, "");
                setName(onlyLetters);
              }}
              sx={{
                width: { xs: "100%", sm: "350px" },
                borderRadius: "10px",
                padding: "10px 15px",
                fontSize: "16px",
                backgroundColor: "white",
                color: "black",
                border: errors.name ? "1px solid #DC3545" : "none",
                outline: "none",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            />
            {errors.name && (
              <Typography color="#DC3545" fontSize="14px">
                {errors.name}
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography fontWeight={500} textAlign="center">
              Tailor your notes to your specialty
            </Typography>
            <FormControl size="small" sx={{ m: 1, minWidth: 250 }}>
              <Select
                labelId="specialty-select-label"
                displayEmpty
                id="specialty-select"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  border: errors.specialty ? "1px solid #DC3545" : "none",
                }}
              >
                <MenuItem value="">
                  <em>Select your Specialty</em>
                </MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              </Select>
            </FormControl>
            {errors.specialty && (
              <Typography color="#DC3545" fontSize="14px">
                {errors.specialty}
              </Typography>
            )}
          </Box>
        );
      case 3:
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography fontWeight={500} textAlign="center">
              What best describes your role?
            </Typography>
            <FormControl size="small" sx={{ m: 1, minWidth: 250 }}>
              <Select
                labelId="role-select-label"
                displayEmpty
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  border: errors.role ? "1px solid #DC3545" : "none",
                }}
              >
                <MenuItem value="">
                  <em>Select your Role</em>
                </MenuItem>
                <MenuItem value="Physician">Physician</MenuItem>
                <MenuItem value="Nurse Practitioner">
                  Nurse Practitioner
                </MenuItem>
                <MenuItem value="Physician Assistant">
                  Physician Assistant
                </MenuItem>
                <MenuItem value="Resident">Resident</MenuItem>
                <MenuItem value="Medical Student">Medical Student</MenuItem>
              </Select>
            </FormControl>
            {errors.role && (
              <Typography color="#DC3545" fontSize="14px">
                {errors.role}
              </Typography>
            )}
          </Box>
        );
      case 4:
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography fontWeight={500} textAlign="center">
              How many clinicians work in your practice or department?
            </Typography>
            <FormControl size="small" sx={{ m: 1, minWidth: 250 }}>
              <Select
                labelId="clinician-count-label"
                displayEmpty
                id="clinician-count-select"
                value={clinicianCount}
                onChange={(e) => setClinicianCount(e.target.value)}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                  border: errors.clinicianCount ? "1px solid #DC3545" : "none",
                }}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="1-5">1-5</MenuItem>
                <MenuItem value="6-10">6-10</MenuItem>
                <MenuItem value="11-20">11-20</MenuItem>
                <MenuItem value="21-50">21-50</MenuItem>
                <MenuItem value="50+">50+</MenuItem>
              </Select>
            </FormControl>
            {errors.clinicianCount && (
              <Typography color="#DC3545" fontSize="14px">
                {errors.clinicianCount}
              </Typography>
            )}
          </Box>
        );
      case 5:
        return (
          <Typography fontWeight={500} textAlign="center">
            Ready to create your first note!
          </Typography>
        );
      default:
        return "Unknown step";
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
        px: { xs: 2, lg: 10, xl: 20 },
      }}
    >
      <Grid container>
        {/* Left Side */}
        <Grid
          item
          xs={12}
          md={9}
          boxShadow={1}
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), url(${OnBoard})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            borderRadius: { xs: 4, md: "16px 0 0 16px" },
            backgroundColor: "#fff",
            p: { xs: 2, md: 4 },
            // height: "85dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box
  sx={{
    display: "flex",
    justifyContent: "space-between", // pushes content to ends
    alignItems: "center",
    width: "100%", // full width of parent
    p: 2,
  }}
>
            <img src={Logo} alt="VBot" width={80} />
            <Box >
                  <Button
                    onClick={handleLogout}
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: "black", mr: "1" }}
                  >
                    Logout 
                  </Button>
                  </Box>
          </Box>

          {/* Stepper */}
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            sx={{ width: "100%", my: 4 }}
          >
            {steps.map((label, index) => (
              <Step
                key={index}
                completed={activeStep > index}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "black",
                  },
                  "& .MuiStepIcon-root": {
                    color: "black",
                    boxShadow:
                      activeStep === index
                        ? "0px 0px 10px 5px rgba(0, 0, 0, 0.4)"
                        : "none",
                    borderRadius: "50%",
                  },
                  "& .MuiStepIcon-root.Mui-active": {
                    color: "black",
                  },
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Message Box */}
          {activeStep === steps.length - 1 ? (
            <Paper
            // sx={{
            //   p: 3,
            //   maxWidth: 500,
            //   backgroundColor: "#333",
            //   color: "#fff",
            //   borderRadius: 4,
            //   textAlign: "center",
            // }}
            >
              {/* <Typography>All steps completed - you're finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 2 }} variant="contained">
                Reset
              </Button> */}
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 3,
                mt: 5,
                width: 500,
                maxWidth: 500,
                height: 220,
                maxHeight: 220,
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: 4,
                textAlign: "start",
              }}
            >
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {activeStep !== 0 && (
                  <Button
                    onClick={handleBack}
                    size="small"
                    variant="text"
                    sx={{ color: "white", mr: "1" }}
                  >
                    Back
                  </Button>
                )}
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  onClick={
                    activeStep === steps.length - 2 ? handleSubmit : handleNext
                  }
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: "white", color: "black" }}
                >
                  {activeStep === steps.length - 2
                    ? "Create First Note"
                    : "Next"}
                </Button>
              </Box>
            </Paper>
          )}

          {/* Privacy Policy */}
          <Box
            mt={5}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "18px", color: "black" }}
            >
              •
            </Typography>
            <Link
              href="#"
              underline="none"
              sx={{ color: "#000", fontWeight: 500 }}
            >
              Privacy Policy
            </Link>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "18px", color: "black" }}
            >
              •
            </Typography>
          </Box>
        </Grid>

        {/* Right Sidebar */}
        <Grid
          item
          xs={12}
          md={3}
          boxShadow={1}
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${OnBoardGalaxy})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            px: 2,
            py: 5,
            borderRadius: { xs: 4, md: "0 16px 16px 0" },
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography fontWeight={"bold"}>Chat with us</Typography>
            <Typography mb={1} sx={{ color: "#ccc" }}>
              Speak to our friendly team via chat.
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography>support@support.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={3}>
              <Email fontSize="small" sx={{ mr: 1 }} />
              <Typography>Message us on 'X'</Typography>
            </Box>

            <Typography mt={5} fontWeight={"bold"}>
              Call us
            </Typography>
            <Typography mb={1} sx={{ color: "#ccc" }}>
              Call our team Mon-Fri
            </Typography>
            <Box display="flex" alignItems="center" mb={3}>
              <Phone fontSize="small" sx={{ mr: 1 }} />
              <Typography>+1 (999) 000-000</Typography>
            </Box>

            <Typography mt={25} fontWeight={"bold"}>
              Social Media
            </Typography>
            <Typography mb={2} sx={{ color: "#ccc" }}>
              Connect with us for latest updates
            </Typography>
            <Box>
              <IconButton color="inherit">
                <Facebook />
              </IconButton>
              <IconButton color="inherit">
                <Instagram />
              </IconButton>
              <IconButton color="inherit">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit">
                <YouTube />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OnboardingUI;
