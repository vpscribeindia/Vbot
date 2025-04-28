const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { User } = require("../../../../config/db"); // Make sure this points to the correct user model

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Access Token:", accessToken);
                console.log("Google Profile:", profile);

                // Check if user already exists by google_id
                let user = await User.findOne({ where: { google_id: profile.id } });

                // If not, create user without display_name
                if (!user) {
                    user = await User.create({
                        google_id: profile.id,
                        email: profile.emails[0].value,
                        password: null, // now accepted
                        auth_provider: "google",
                    });
                }
                console.log("usersssssssss", user)
                // Return user ID (primary key)
                return done(null, user); // ✅ Return the whole user object

            } catch (err) {
                console.error("Error in Google OAuth strategy:", err);
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    if (user && user.id) {
        done(null, user.id); // ✅ store only ID in session
    } else {
        done(new Error("User is invalid during serialization"), null); // ❌ fallback in case something is wrong
    }
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        if (!user) return done(new Error("User not found during deserialization"), null);
        done(null, user); // ✅ attaches full user to req.user
    } catch (err) {
        done(err, null);
    }
});

// Google login route initiator
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Callback after Google login
const googleCallback = (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/", session: true }, (err, user) => {
        if (err || !user) {
            return res.redirect("/");
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);

            // ✅ Now this will work
            console.log("✅ Google login success - MySQL User ID:", user.id);

            res.status(200).json({ id: user.id });
        });
    })(req, res, next);
};


// User profile route
const profile = (req, res) => {
    if (!req.user) return res.redirect("/");
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
