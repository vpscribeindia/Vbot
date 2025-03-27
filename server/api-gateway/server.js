require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const compression = require("compression");
const cacheController = require("express-cache-controller");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const fileRoutes = require('./routes/fileRoute');
const errorHandler = require('./middlewares/errorHandler');
const setupSocket = require('./services/socketService');
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
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Middleware for JSON body parsing
app.use(express.static("./uploads"));
app.use(bodyParser.json());
app.use(compression());
app.use(cacheController({ maxAge: 60 }));
// Mount API routes

app.use('/api', fileRoutes);

// Global error handler
app.use(errorHandler);

// Initialize Socket.io with Redis pub/sub
setupSocket(io);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 API-Gateway running on port ${PORT}`);
});