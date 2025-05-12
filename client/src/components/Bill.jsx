import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
import moment from "moment";

const plans = [
  { name: "trial", price: "$0/mo", features: ["Usage Limit - 60 Minutes"] },
  { name: "basic", price: "$9/mo", features: ["Usage Limit - 170 Minutes"] },
  {name: "standard", price: "$19/mo", features: ["Usage Limit - 500 Minutes"], },
  { name: "premium", price: "$49/mo", features: ["Usage Limit - Unlimited"] },
];

const BillingPopup = () => {
  const [open, setOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("");
  const [endDate, setEndDate] = useState(null);

  const API_MAIN_URL = import.meta.env.VITE_API_URL;
  const GET_BILLING_URL = `${API_MAIN_URL}/api/getBillingById`;
  const UPDATE_BILLING_URL = `${API_MAIN_URL}/api/updateBilling`;

  useEffect(() => {
    const fetchBillingStatus = async () => {
      try {
        const response = await axios.get(GET_BILLING_URL, {
          withCredentials: true,
        });
        setCurrentPlan(response.data.pakage_type);
        setEndDate(response.data.package_end_date);
      } catch (error) {
        console.error("Error fetching billing status:", error);
        setCurrentPlan("");
        setEndDate(null);
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
      const response = await axios.put(
        UPDATE_BILLING_URL,
        { pakage_type: selectedPlan.name },
        { withCredentials: true }
      );

      setCurrentPlan(selectedPlan.name);
      setEndDate(response.data.package_end_date);

      setPaymentOpen(false);
      setOpen(false);

      toast.success(
        `Payment successful! Subscribed to ${
          selectedPlan.name
        } plan until ${new Date(
          response.data.package_end_date
        ).toLocaleDateString()}`
      );
    } catch (error) {
      console.error("Payment update failed:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const isPlanActive = endDate && new Date() < new Date(endDate);

  return (
    <Box>
      <a
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
        onClick={handleOpen}
      >
        Subscriptions
      </a>

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
              .filter((plan) =>
                currentPlan !== "trial" ? plan.name !== "trial" : true
              )
              .map((plan) => {
                const isCurrentPlan = plan.name === currentPlan;
                const isTrialExpired = isCurrentPlan && currentPlan === "trial" && !isPlanActive;

                return (
                  <Grid item xs={12} sm={6} md={3} key={plan.name}>
                    <Card
                      sx={{
                        p: 1,
                        borderRadius: 4,
                        height: "100%",
                        display: "flex", // 👈 ADD
                        flexDirection: "column", // 👈 ADD
                        justifyContent: "space-between", // 👈 ADD
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
                            label={
                              isPlanActive
                                ? "Current Plan Active"
                                : "Plan Expired"
                            }
                            color={isPlanActive ? "success" : "error"}
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

                        {plan.features.map((feature, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{ my: 0.5 }}
                          >
                            • {feature}
                          </Typography>
                        ))}

                        {isCurrentPlan && endDate && (
                          <Typography
                            variant="caption"
                            sx={{ display: "block", mt: 1, color: "#555" }}
                          >
                            End Date: {moment(endDate).format("MMMM Do YYYY")}
                          </Typography>
                        )}
                      </CardContent>

                      {/* 👉 BUTTON stays at bottom */}
                      <Box sx={{ px: 2, mt: "auto" }}>
                        {!isTrialExpired && (
                          <Button
                            variant="contained"
                            fullWidth
                            disabled={isCurrentPlan && isPlanActive}
                            onClick={() => handleUpgradeClick(plan)}
                          >
                            {isCurrentPlan
                              ? isPlanActive
                                ? "Your Plan"
                                : "Renew Plan"
                              : "Upgrade"}
                          </Button>
                        )}
                      </Box>
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

      <Dialog open={paymentOpen} onClose={handlePaymentClose}>
        <DialogTitle textAlign="center">
          Payment for {selectedPlan?.name} Plan
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
            Confirm payment of <strong>{selectedPlan?.price}</strong> to upgrade
            to <strong>{selectedPlan?.name}</strong> plan.
          </Typography>

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
