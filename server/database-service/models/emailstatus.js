const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const EmailStatus = sequelize.define("EmailStatus", {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: {
        type: DataTypes.UUID,
        references: { model: 'Users', key: 'id' }

    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
status: {
        type: DataTypes.ENUM("notsent", "sent"),
        defaultValue: "notsent",
    },


});
module.exports = EmailStatus;