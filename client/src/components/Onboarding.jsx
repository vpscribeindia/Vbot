import React from "react";
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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Logo from "../assets/logo.png";
import OnBoard from "../assets/onboard.png";
import OnBoardGalaxy from "../assets/onboardgalaxy.png";
import { useNavigate } from "react-router-dom";
import {
  Email,
  Phone,
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
  Twitter,
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
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [specialty, setSpecialty] = React.useState("");

  const isStepSkipped = (step) => skipped.has(step);

  const handleSpecialtyChange = (event) => {
    setSpecialty(event.target.value);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
              sx={{
                width: { xs: "100%", sm: "350px" },
                borderRadius: "10px",
                padding: "10px 15px",
                fontSize: "16px",
                backgroundColor: "white",
                color: "black",
                border: "none",
                outline: "none",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            />
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
              <InputLabel id="specialty-select-label"></InputLabel>
              <Select
                labelId="specialty-select-label"
                id="specialty-select"
                value={specialty}
                displayEmpty
                onChange={handleSpecialtyChange}
                inputProps={{ "aria-label": "Without label" }}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <MenuItem value="">
                  <em>Your Specialty</em>
                </MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              </Select>
            </FormControl>
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
              <InputLabel id="specialty-select-label"></InputLabel>
              <Select
                labelId="specialty-select-label"
                id="specialty-select"
                value={specialty}
                displayEmpty
                onChange={handleSpecialtyChange}
                inputProps={{ "aria-label": "Without label" }}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <MenuItem value="">
                  <em>Your Role</em>
                </MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              </Select>
            </FormControl>
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
              <InputLabel id="specialty-select-label"></InputLabel>
              <Select
                labelId="specialty-select-label"
                id="specialty-select"
                value={specialty}
                displayEmpty
                onChange={handleSpecialtyChange}
                inputProps={{ "aria-label": "Without label" }}
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <MenuItem value="">
                  <em>Select How many?</em>
                </MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Dermatology">Dermatology</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              </Select>
            </FormControl>
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
              alignSelf: "flex-start",
              m: 2,
            }}
          >
            <img src={Logo} alt="VBot" width={80} />
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
              sx={{
                p: 3,
                maxWidth: 500,
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <Typography>All steps completed - you're finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 2 }} variant="contained">
                Reset
              </Button>
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 3,
                mt: 5,
                width: 500,
                maxWidth: 500,
                height: 200,
                maxHeight: 200,
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
                  onClick={handleNext}
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
