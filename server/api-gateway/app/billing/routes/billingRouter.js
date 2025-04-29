const express = require("express");


const {
    createBilling,
    getAllBilling,
    getBillingById,
    updateBilling,
    deleteBilling,
    getBillingByMinutes,
} = require("../controllers/billingController");
const authenticate = require('../../../middlewares/authHandler');
const router = express.Router();

router.post("/createBilling", createBilling);
router.get("/getAllBillings", getAllBilling);
router.get("/getBillingById:id", getBillingById);
router.put("/updateBilling:id", updateBilling);
router.delete("/deleteBilling:id", deleteBilling);
router.get("/getBillingByMinutes", authenticate,getBillingByMinutes);

module.exports = router;
