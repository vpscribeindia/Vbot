const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User } = require("../../../config/db");

const signup = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    console.log(req.body)
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Ensure user has a password (Google users may not have one)
        if (!user.password) {
            return res.status(401).json({ message: "This account is registered with Google. Please log in using Google." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false, // set true if https
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour
          }).json({ message: 'Login successful' });
        // res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


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

const protectedUser = async (req, res) => {
    res.json({
      message: 'This is protected data!',
      user: req.user,
    });
};

module.exports = { signup, login, getUsers, updateUser, deleteUser,protectedUser };
