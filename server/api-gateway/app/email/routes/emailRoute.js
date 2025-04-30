const express = require("express");
const { sendEmail,createStatus,useremailfind,updateStatus, getolddate, updatedate, getuserid, getemailstatus } = require("../controllers/emailController");

const router = express.Router();
const {authenticate }= require('../../../middlewares/authHandler');
router.post("/sendemail", authenticate,sendEmail);
router.post("/addstatus", authenticate,createStatus);
router.get("/emailfind", authenticate,useremailfind);
router.put("/updatestatus", authenticate,updateStatus);
router.get("/getolddate", authenticate,getolddate);
router.put("/updatedate", authenticate,updatedate);
router.get("/getuserid", authenticate,getuserid);
router.get("/getemailstatus", authenticate,getemailstatus);

module.exports = router;