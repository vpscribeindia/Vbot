require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const compression = require("compression");
const cacheController = require("express-cache-controller");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const fileRoutes = require('./app/files-transcriptions/routes/fileRoute');
const transcriptRoutes = require('./app/files-transcriptions/routes/transcriptRoute');
const authRoutes = require('./app/authenticator/routes/authRoute');
const questionRoutes = require('./app/question/routes/questionRoute');
const userRoutes = require('./app/user/routes/userRoute');
const billingRoutes = require('./app/billing/routes/billingRouter');
const emailRoutes = require('./app/email/routes/emailRoute');
const loggingRoutes = require('./app/logging-monitoring/routes/loggingRoute');

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


//file routes
app.use('/api', fileRoutes);
//transcript routes
app.use('/api', transcriptRoutes);

//authRoutes
app.use('/api', authRoutes);
app.use('/api', questionRoutes);
app.use('/api', userRoutes);
app.use('/auth', authRoutes);

app.use('/api', emailRoutes);

app.use('/api', billingRoutes);
app.use('/api', loggingRoutes);




// Global error handler
app.use(errorHandler);

// Initialize Socket.io with Redis pub/sub
setupSocket(io);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 API-Gateway running on port ${PORT}`);
});