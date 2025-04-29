const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Billing = sequelize.define("Billing", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: {
        type: DataTypes.UUID,
        references: { model: 'Users', key: 'id' }

    },
    paypal_order_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
    },
    status: {
        type: DataTypes.ENUM("active", "expired", "cancelled"),
        defaultValue: "active",
    },
    pakage_type: {
        type: DataTypes.ENUM("basic", "standard", "premium", "trial"),
        allowNull: false,
        defaultValue: "trial",
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
