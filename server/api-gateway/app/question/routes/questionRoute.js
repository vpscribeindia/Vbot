// app/routers/userInfoRouter.js
const express = require("express");

const {
    createUserInfo,
    getUserInfo,
    updateUserInfo,
    deleteUserInfo,
} = require("../controllers/questionControllers");
const authenticate = require('../../../middlewares/authHandler');

const router = express.Router();

router.post("/createQuestion",authenticate, createUserInfo);
router.get("/getQuestion", authenticate, getUserInfo);
router.put("/updateQuestion:id",authenticate,  updateUserInfo);
router.delete("/deleteQuestion:id",authenticate,  deleteUserInfo);

module.exports = router;
