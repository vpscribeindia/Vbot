const express = require("express");
const { createLogging, getLoggingUsers } = require("../controllers/loggingController");

const router = express.Router();
const {authenticate }= require('../../../middlewares/authHandler');
router.post("/createLogging", authenticate,createLogging);
router.get("/getLogging", authenticate,getLoggingUsers);

module.exports = router;