const { Userinfo } = require("../../../config/db");

const createUserInfo = async (req, res) => {
    try {
        const { user_id, display_name, specialty, role, praction } = req.body;
        const userInfo = await Userinfo.create({ user_id, display_name, specialty, role, praction });

        res.status(201).json({ message: "User info created successfully", data: userInfo });
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
