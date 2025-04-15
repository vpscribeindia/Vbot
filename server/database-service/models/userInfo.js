// questionModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Userinfo = sequelize.define("Userinfo", {
    user_id: {
        type: DataTypes.UUID,
        references: { model: 'Users', key: 'id' }

    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    praction: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true, // <- This tells Sequelize NOT to pluralize table name
});
module.exports = Userinfo;
