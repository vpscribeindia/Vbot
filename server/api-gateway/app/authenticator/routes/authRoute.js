const express = require("express");
const { googleAuth, googleCallback, signup,login, logout,protectedUser } = require("../controllers/authController");
const {authenticate} = require('../../../middlewares/authHandler');
const router = express.Router();

// Google Authentication
router.get("/google", googleAuth);

// Google OAuth Callback
router.get("/google/callback", googleCallback, (req, res) => {
    res.redirect("/profile");
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/protected", authenticate,protectedUser);
// Logout Route
router.get("/logout",authenticate, logout);

module.exports = router;
