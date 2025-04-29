import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

const plans = [
  {
    name: "Free",
    price: "$0/mo",
    features: ["1 User", "1GB Storage", "Community Support"],
  },
  {
    name: "Basic",
    price: "$9/mo",
    features: ["5 Users", "10GB Storage", "Email Support"],
  },
  {
    name: "Standard",
    price: "$19/mo",
    features: ["10 Users", "100GB Storage", "Priority Support"],
  },
  {
    name: "Premium",
    price: "$49/mo",
    features: ["Unlimited Users", "1TB Storage", "24/7 Phone Support"],
  },
];

const BillingPopup = () => {
  const [open, setOpen] = useState(false);

  // Assume you fetch user's current plan from API (hardcoding here for example)
  const currentPlan = "Free";

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button variant="contained" sx={{p:1}} onClick={handleOpen}>
        Choose Plan
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent
            backdropFilter: "blur(5px)", // actual blur
            WebkitBackdropFilter: "blur(5px)", // Safari support
          },
        }}
      >
        <DialogTitle textAlign="center" fontWeight="bold">
          Billing Plans
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={1} justifyContent="center">
            {plans.map((plan) => {
              const isCurrentPlan = plan.name === currentPlan;

              return (
                <Grid item xs={12} sm={6} md={3} key={plan.name}>
                  <Card
                    sx={{
                      p: 1,
                      borderRadius: 4,
                      textAlign: "center",
                      boxShadow: isCurrentPlan ? 6 : 2,
                      border: isCurrentPlan
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                      backgroundColor: isCurrentPlan ? "#e3f2fd" : "#fff",
                      transition: "0.3s",
                      position: "relative",
                    }}
                  >
                    <CardContent>
                      {isCurrentPlan && (
                        <Chip
                          label="Current Plan"
                          color="success"
                          size="small"
                          sx={{ position: "absolute", top: 10, right: 10 }}
                        />
                      )}
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" color="primary" mb={2}>
                        {plan.price}
                      </Typography>
                      {plan.features.map((feature, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{ my: 0.5 }}
                        >
                          • {feature}
                        </Typography>
                      ))}
                      <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        fullWidth
                        disabled={isCurrentPlan}
                        onClick={() =>
                          alert(`Subscribed to ${plan.name} Plan!`)
                        }
                      >
                        {isCurrentPlan ? "Your Plan" : "upgrade"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "red" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingPopup;
