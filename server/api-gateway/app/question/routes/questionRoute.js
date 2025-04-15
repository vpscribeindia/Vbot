// app/routers/userInfoRouter.js
const express = require("express");

const {
    createUserInfo,
    getUserInfo,
    updateUserInfo,
    deleteUserInfo,
} = require("../controllers/questionControllers");

const router = express.Router();

router.post("/createQuestion", createUserInfo);
router.get("/getQuestion", getUserInfo);
router.put("/updateQuestion:id", updateUserInfo);
router.delete("/deleteQuestion:id", deleteUserInfo);

module.exports = router;
