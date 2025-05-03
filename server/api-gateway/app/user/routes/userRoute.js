const express = require("express");
const { getUsers, updateUser, deleteUser,getAdminAllUsers,getUserById,updateAdminUser, updatePassword, addUsers } = require("../controllers/userController");

const router = express.Router();
const {authenticate} = require('../../../middlewares/authHandler');

router.get("/users",authenticate,getUsers);
router.get("/usersId",authenticate,getUserById);
router.put("/updateUsers", authenticate,updateUser);
router.delete("/deleteUsers",authenticate,deleteUser);
router.get("/getAdminUsers",getAdminAllUsers);
router.put("/updateAdminUser/:userId", updateAdminUser);
router.put("/updatepassword", authenticate,updatePassword);
router.post("/addUsers", authenticate,addUsers);




module.exports = router;
