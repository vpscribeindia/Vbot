const express = require("express");


const {
    createBilling,
    getAllBilling,
    getBillingById,
    updateBilling,
    deleteBilling,
    getBillingByMinutes,
    getUserBilling,
    updateUserBilling,
} = require("../controllers/billingController");
const {authenticate} = require('../../../middlewares/authHandler');
const router = express.Router();

router.post("/createBilling", createBilling);
router.get("/getAllBillings", getAllBilling);
router.get("/getBillingById",authenticate, getBillingById);
router.put("/updateBilling",authenticate, updateBilling);
router.delete("/deleteBilling:id", deleteBilling);
router.get("/getBillingByMinutes", authenticate,getBillingByMinutes);
router.get("/getUserBilling", authenticate,getUserBilling);
router.put("/updateUserBilling", authenticate,updateUserBilling);



module.exports = router;
