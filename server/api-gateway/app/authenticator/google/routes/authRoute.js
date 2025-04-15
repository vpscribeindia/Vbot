const express = require("express");
const { googleAuth, googleCallback, profile, logout } = require("../controllers/authController");

const router = express.Router();

// Google Authentication
router.get("/auth/google", googleAuth);

// Google OAuth Callback
router.get("/auth/google/callback", googleCallback, (req, res) => {
    res.redirect("/profile");
});

// Profile Route
router.get("/profile", profile);

// Logout Route
router.get("/logout", logout);

module.exports = router;
