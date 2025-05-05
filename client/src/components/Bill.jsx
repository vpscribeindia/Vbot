import React, { useState, useEffect } from "react";
import axios from "axios";
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
    name: "trial",
    price: "$0/mo",
    features: ["Usage Limit - 60 Minutes"],
  },
  {
    name: "basic",
    price: "$9/mo",
    features: ["Usage Limit - 170 Minutes"],
  },
  {
    name: "standard",
    price: "$19/mo",
    features: ["Usage Limit - 500 Minutes"],
  },
  {
    name: "premium",
    price: "$49/mo",
    features: ["Usage Limit - Unlimited"],
  },
];

const BillingPopup = () => {
  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("");

  const API_MAIN_URL = import.meta.env.VITE_API_URL;
  const GET_BILLING_URL = `${API_MAIN_URL}/api/getBillingById`;
  const UPDATE_BILLING_URL = `${API_MAIN_URL}/api/updateBilling`;

  useEffect(() => {
    const fetchBillingStatus = async () => {
      try {
        const response = await axios.get(GET_BILLING_URL, { withCredentials: true });
        setCurrentPlan(response.data.pakage_type);
      } catch (error) {
        console.error("Error fetching billing status:", error);
        setCurrentPlan("");
      }
    };
    fetchBillingStatus();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePaymentClose = () => setPaymentOpen(false);

  const handleUpgradeClick = (plan) => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      await axios.put(
        UPDATE_BILLING_URL,
        { pakage_type: selectedPlan.name }, // sending selected plan
        { withCredentials: true }
      );
      setCurrentPlan(selectedPlan.name);
      setPaymentOpen(false);
      setOpen(false);
      alert(`Payment successful! Subscribed to ${selectedPlan.name} plan.`);
    } catch (error) {
      console.error("Payment update failed:", error);
      alert("Payment failed. Please try again.");
    }
  };  

  return (
    <Box>
      <a
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
        sx={{ p: 1 }}
        onClick={handleOpen}
      >
        Subscriptions
      </a>

      {/* Main Billing Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          },
        }}
      >
        <DialogTitle textAlign="center" fontWeight="bold">
          Billing Plans
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} justifyContent="center">
          {plans
            .filter((plan) => currentPlan !== "trial" ? plan.name !== "trial" : true)
              .map((plan) => {
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
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        mt={1}
                        mb={1}
                        textTransform="capitalize"
                      >
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" color="primary" mb={2}>
                        {plan.price}
                      </Typography>

                      {/* Uncomment below to show features */}
                      {plan.features.map((feature, index) => (
                        <Typography key={index} variant="body2" sx={{ my: 0.5 }}>
                          • {feature}
                        </Typography>
                      ))}

                      <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        fullWidth
                        disabled={isCurrentPlan}
                        onClick={() => handleUpgradeClick(plan)}
                      >
                        {isCurrentPlan ? "Your Plan" : "Upgrade"}
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

      {/* Payment Dialog */}
      <Dialog open={paymentOpen} onClose={handlePaymentClose}>
        <DialogTitle textAlign="center">
          Payment for {selectedPlan?.name} Plan
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
            Confirm payment of <strong>{selectedPlan?.price}</strong> to
            upgrade to <strong>{selectedPlan?.name}</strong> plan.
          </Typography>

          {/* You can replace this button with real payment gateway later */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePaymentSuccess}
          >
            Pay Now
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingPopup;
