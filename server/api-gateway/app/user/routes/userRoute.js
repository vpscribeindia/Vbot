const express = require("express");
const { getUsers, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();
const {authenticate} = require('../../../middlewares/authHandler');

router.get("/users",authenticate,getUsers);
router.put("/updateUsers", authenticate,updateUser);
router.delete("/deleteUsers", authenticate,deleteUser);



module.exports = router;
