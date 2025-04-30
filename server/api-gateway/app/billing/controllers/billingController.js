const { Billing } = require("../../../config/db");

const moment = require("moment");

const createBilling = async (req, res) => {
  try {
    const { user_id, amount, status, pakage_type, usage_limit, pakage_discription } = req.body;

    const package_start_date = new Date(); // today
    const package_end_date = moment(package_start_date).add(1, 'month').toDate(); // +1 month

    const billing = await Billing.create({
      user_id,
      amount,
      status,
      pakage_type,
      usage_limit,
      pakage_discription,
      package_start_date,
      package_end_date,
    });

    // Format date fields in DD-MM-YYYY format
    const formattedBilling = {
      ...billing.toJSON(),
      package_start_date: moment(package_start_date).format("DD-MM-YYYY"),
      package_end_date: moment(package_end_date).format("DD-MM-YYYY"),
    };

    res.status(201).json({ message: "Billing record created", data: formattedBilling });
  } catch (error) {
    console.error("❌ Error in Billing record creation:", error);
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};


// Get all billing records
const getAllBilling = async (req, res) => {
  try {
    const billings = await Billing.findAll();
    res.status(200).json(billings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single billing record
const getBillingById = async (req, res) => {
  try {
      if (!req.user || !req.user.id) {
          return res.status(401).json({ error: "Unauthorized: Missing user ID" });
        }
        const userId = req.user.id;
    const billing = await Billing.findOne({where:{user_id:userId},attributes:['pakage_type']});
    if (!billing) return res.status(404).json({ message: "Billing not found" });
    res.status(200).json(billing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBillingByMinutes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    const userId = req.user.id;
    const billing = await Billing.findOne({
      where: { user_id: userId },
      attributes: ['usage_limit'],
    });
    if (!billing) return res.status(404).json({ message: "Billing not found" });
    res.status(200).json({usage_limit : billing.usage_limit});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update billing record
const updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);
    if (!billing) return res.status(404).json({ message: "Billing not found" });

    await billing.update(req.body);
    res.status(200).json({ message: "Billing updated", billing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete billing record
const deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByPk(req.params.id);
    if (!billing) return res.status(404).json({ message: "Billing not found" });

    await billing.destroy();
    res.status(200).json({ message: "Billing deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBilling,
  getAllBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
  getBillingByMinutes,
};
