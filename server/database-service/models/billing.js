const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Billing = sequelize.define("Billing", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: {
        type: DataTypes.UUID,
        references: { model: 'Users', key: 'id' }

    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
    },
    pakage_type: {
        type: DataTypes.ENUM("basic", "standard", "premium"),
        allowNull: false,
        defaultValue: "basic",
    },
    package_end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    package_start_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    usage_limit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pakage_discription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Billing;
