const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // ✅ allow null so Google Users can register
    },

    auth_provider: {
        type: DataTypes.STRING,
        defaultValue: "local", // or "google"
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user', // default role is 'user'
        validate: {
            isIn: [['admin', 'user']] // Only allow 'admin' or 'user'
        }
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive",
    },
});

module.exports = User;
