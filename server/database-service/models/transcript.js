const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Transcript = sequelize.define('Transcript', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fileId: { 
    type: DataTypes.UUID,
    references: { model: 'Files', key: 'id' }
  },
  content: { type: DataTypes.JSON, allowNull: false }
});

module.exports = Transcript;
