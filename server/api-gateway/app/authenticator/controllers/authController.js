const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../../../config/db');
const qs = require('querystring');
const bcrypt = require("bcrypt");


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.REDIRECT_DOMAIN}:${process.env.PORT}/auth/google/callback`; 

// Step 1: Redirect to Google Auth URL
const googleAuth = (req, res) => {
  const params = qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

// Step 2: Handle Google callback
const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      qs.stringify({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { id_token } = tokenResponse.data;

    // Decode ID token (JWT) to get user info
    const userInfo = jwt.decode(id_token);

    if (!userInfo) {
      return res.status(400).json({ error: 'Invalid ID token' });
    }

    const { sub: googleId, email } = userInfo;

    // Find or create user in your DB
    let user = await User.findOne({ where: { google_id: googleId } });
    let isNewUser = false;
    if (!user) {
      user = await User.create({
        google_id: googleId,
        email: email,
        password: null, // No password for OAuth users
        auth_provider: 'google',
        status : "inactive",
      });
      isNewUser = true;
    }


const myToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  expiresIn: '24h',
});


    // Set HTTP-only cookie
    res.cookie('accessToken', myToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1h
    });

    if (isNewUser) {
        return res.redirect(`${process.env.FRONTEND_URL}#/onboarding`);
      } else {
        return res.redirect(`${process.env.FRONTEND_URL}#/dashboard`);
      }

  } catch (err) {
    console.error('Google OAuth callback error:', err.response?.data || err.message);
    res.redirect(`${process.env.FRONTEND_URL}#/login?error=OAuthFailed`);
  }
};

const signup = async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      // 🔥 First check if user already exists
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
          return res.status(409).json({ message: "User already exists" }); // 409 Conflict
      }

      // 🛡️ If not, create new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
          email,
          password: hashedPassword,
          status : "inactive",

      });

      res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
  }

  try {
      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Ensure user has a password (Google users may not have one)
      if (!user.password) {
          return res.status(401).json({ message: "This account is registered with Google. Please log in using Google." });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

const token = jwt.sign({id: user.id, role:user.role}, process.env.JWT_SECRET, {
expiresIn: '24h',
});

      res.cookie('accessToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // set true if https
          sameSite: 'strict',
          maxAge: 3600000, // 1 hour
      }).json({ message: 'Login successful' });
      // res.status(200).json({ message: "Login successful", token });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server error" });
  }
};

const protectedUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByPk(userId, {
      attributes: ['status'] 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'This is protected data!',
      user,
    });
  } catch (error) {
    console.error('Error fetching protected user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { googleAuth, googleCallback, signup,login, protectedUser, logout };
