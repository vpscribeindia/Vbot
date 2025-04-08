const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const File = sequelize.define('File', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fileName: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.FLOAT, allowNull: true },
  status: { type: DataTypes.ENUM('queued', 'processing', 'completed', 'failed'), defaultValue: 'queued' }
});

module.exports = File;
