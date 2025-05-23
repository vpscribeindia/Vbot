const { User,Userinfo, Billing,EmailStatus,Logging_Monitoring } = require("../../../config/db");
const moment = require("moment");

const createUserInfo = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized: Missing user ID" });
          }
          const userId = req.user.id;
        const {display_name, specialty, role, praction } = req.body;

        // ✅ Validate required fields
        if (!userId || !display_name || !specialty || !role || !praction) {
            return res.status(400).json({
                message: "All fields (userId, display_name, specialty, role, praction) are required"
            });
        }

        // ✅ Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Create user info
        const userInfo = await Userinfo.create({user_id: userId, display_name, specialty, role, praction });

        // ✅ Define trial dates
        const package_start_date = moment();
        const package_end_date = moment(package_start_date).add(7, "days");

        // ✅ Create billing
        const billing = await Billing.create({
            user_id: userId,
            amount: "0",
            status: "active",
            payment_status: "paid",
            pakage_type: "trial",
            usage_limit: "3600",
            pakage_discription: "free trial",
            package_start_date: package_start_date.toDate(),
            package_end_date: package_end_date.toDate(),
        });
        const formattedDate = moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).local().format('YYYY-MM-DD HH:mm:ss');
        if(user.role == 'user'){
        await EmailStatus.create({
            user_id: userId,
            date: formattedDate,
            status: 'notsent'
          })
        }
        if(user.status == 'inactive'){
            await Logging_Monitoring.create({
                    user_id:userId,
                    date:formattedDate,
                    activity:'login successfully',
                    role:user.role
                  });
            }
        // ✅ Activate user
        user.status = "active";
        await user.save();

        // ✅ Respond with both userInfo and billing
        res.status(201).json({
            message: "User profile and trial billing created successfully",
            userInfo: userInfo,
            user:user.role,
            billing: {
                ...billing.toJSON(),
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
