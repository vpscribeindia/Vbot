require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const passport = require("passport");
const bodyParser = require("body-parser");
const compression = require("compression");
const session = require("express-session");
const cacheController = require("express-cache-controller");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const fileRoutes = require('./app/files-transcriptions/routes/fileRoute');
const transcriptRoutes = require('./app/files-transcriptions/routes/transcriptRoute');
const authRoutes = require('./app/authenticator/google/routes/authRoute');
const questionRoutes = require('./app/question/routes/questionRoute');
const userRoutes = require('./app/user/routes/userRoute');
const billingRoutes = require('./app/billing/routes/billingRouter');

const errorHandler = require('./middlewares/errorHandler');

const setupSocket = require('./app/files-transcriptions/services/socketService');
const app = express();
const allowedOrigins = process.env.APP_ALLOWED_ORIGINS.split(",");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },

  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
credentials:true,

};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsOptions
});

// Middleware for JSON body parsing
app.use(express.static("./app/files-transcriptions/uploads"));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(compression());
app.use(cacheController({ maxAge: 0 }));
// Mount API routes

// Express session configuration
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Home Page
app.get("/googlelogin", (req, res) => {
  res.send("<a href='/auth/google'>Sign Up with Google</a><br><a href='/auth/google'>Sign In with Google</a>");
});

//file routes
app.use('/api', fileRoutes);
//transcript routes
app.use('/api', transcriptRoutes);

//authRoutes
app.use('/api', authRoutes);
app.use('/api', questionRoutes);
app.use('/auth', userRoutes);
app.use('/auth', authRoutes);

app.use('/api', billingRoutes);



// Global error handler
app.use(errorHandler);

// Initialize Socket.io with Redis pub/sub
setupSocket(io);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 API-Gateway running on port ${PORT}`);
});