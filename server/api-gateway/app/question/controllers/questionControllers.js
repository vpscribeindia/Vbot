const { Userinfo, Billing } = require("../../../config/db");
const moment = require("moment");

const createUserInfo = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
      }

    try {
        const userId = req.user.id;
        const {display_name, specialty, role, praction } = req.body;

        // ✅ First define dates
        const package_start_date = moment();
        const package_end_date = moment(package_start_date).add(7, "days");

        const userInfo = await Userinfo.create({user_id:userId, display_name, specialty, role, praction });

        const billing = await Billing.create({
            user_id:userId,
            amount: "0",
            // status: "active",
            status: "paid", // Set it as paid since PayPal confirms
            pakage_type: "basic",
            usage_limit: "3600",
            pakage_discription: "free trial",
            package_start_date: package_start_date.toDate(), // save as Date format
            package_end_date: package_end_date.toDate(),     // save as Date format
        });

        res.status(201).json({
            message: "Free trial added successfully",
            data: {
                ...billing.toJSON(),
                usage_limit: String(parseInt(billing.usage_limit) / 60), // 🔥 Convert seconds to minutes
                package_start_date: package_start_date.format("DD-MM-YYYY"),
                package_end_date: package_end_date.format("DD-MM-YYYY"),
            },
        });

    } catch (error) {
        console.error("❌ Error in createUserInfo:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const users = await Userinfo.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching data" });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Userinfo.update(req.body, { where: { id } });
        if (updated) {
            const updatedUser = await Userinfo.findByPk(id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "UserInfo not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating user info" });
    }
};

const deleteUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Userinfo.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: "User info deleted" });
        } else {
            res.status(404).json({ message: "UserInfo not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting user info" });
    }
};

module.exports = {
    createUserInfo,
    getUserInfo,
    updateUserInfo,
    deleteUserInfo,
};
