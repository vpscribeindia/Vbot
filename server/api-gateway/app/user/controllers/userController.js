
const { User } = require("../../../config/db");


const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateUser = async (req, res) => {
    const { id, display_name, email } = req.body; // Get ID from the request body
    //console.log("Request Body:", req.body); // Fix the logging issue

    try {
        const user = await User.findByPk(id);
        //console.log("Fetched User:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only if values are provided
        if (display_name) user.display_name = display_name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


  


module.exports = { getUsers, updateUser, deleteUser };
