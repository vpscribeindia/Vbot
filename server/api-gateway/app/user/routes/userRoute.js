const express = require("express");
const { signup, login, getUsers, updateUser, deleteUser, protectedUser } = require("../controllers/userController");

const router = express.Router();
const authenticate = require('../../../middlewares/authHandler');
router.post("/signup", signup);
router.post("/login", login);
router.get("/users",getUsers);
router.put("/updateUsers", authenticate,updateUser);
router.delete("/deleteUsers", authenticate,deleteUser);
router.get("/protected", authenticate,protectedUser);

module.exports = router;
