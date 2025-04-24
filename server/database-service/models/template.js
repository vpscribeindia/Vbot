const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Template = sequelize.define("Template", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    templateName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    headings: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
});

module.exports = Template;
