const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../../../../config/db');
const qs = require('querystring');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback'; 
const FRONTEND_URL = 'http://localhost:5173/#'; 

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

    // Create your own JWT
    const myToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set HTTP-only cookie
    res.cookie('accessToken', myToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1h
    });

    if (isNewUser) {
        return res.redirect(`${FRONTEND_URL}/onboarding`);
      } else {
        return res.redirect(`${FRONTEND_URL}/dashboard`);
      }

  } catch (err) {
    console.error('Google OAuth callback error:', err.response?.data || err.message);
    res.redirect(`${FRONTEND_URL}/login?error=OAuthFailed`);
  }
};

// Protected profile route
const profile = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ id: req.user.id, email: req.user.email });
};

// Logout
const logout = (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { googleAuth, googleCallback, profile, logout };
