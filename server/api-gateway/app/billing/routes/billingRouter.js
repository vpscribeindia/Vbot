const express = require("express");


const {
    createBilling,
    getAllBilling,
    getBillingById,
    updateBilling,
    deleteBilling,
} = require("../controllers/billingController");

const router = express.Router();

router.post("/createBilling", createBilling);
router.get("/getAllBillings", getAllBilling);
router.get("/getBillingById:id", getBillingById);
router.put("/updateBilling:id", updateBilling);
router.delete("/deleteBilling:id", deleteBilling);

module.exports = router;
