const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Logging_Monitoring = sequelize.define("Logging_Monitoring", {

    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: {
        type: DataTypes.UUID,
        references: { model: 'Users', key: 'id' }

    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
activity: {
        type: DataTypes.ENUM("login successfully", "transcription done","voice recorded done"),
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },

});
module.exports = Logging_Monitoring;