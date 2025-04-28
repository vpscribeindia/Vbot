const express = require("express");
const { signup, login, getUsers, updateUser, deleteUser, protectedUser } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getUsers);
router.put("/updateUsers", updateUser);
router.delete("/deleteUsers", deleteUser);
router.get("/protected", protectedUser);

module.exports = router;
