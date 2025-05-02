const express = require("express");
const { getUsers, updateUser, deleteUser,getAdminAllUsers,getUserById,updateAdminUser } = require("../controllers/userController");

const router = express.Router();
const {authenticate} = require('../../../middlewares/authHandler');

router.get("/users",authenticate,getUsers);
router.get("/usersId",getUserById);
router.put("/updateUsers", authenticate,updateUser);
router.delete("/deleteUsers",authenticate,deleteUser);
router.get("/getAdminUsers",getAdminAllUsers);
router.put("updateAdminUser/:userId", updateAdminUser);


module.exports = router;
