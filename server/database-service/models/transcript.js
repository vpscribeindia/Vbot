const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Transcript = sequelize.define('Transcript', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fileId: { 
    type: DataTypes.UUID,
    references: { model: 'Files', key: 'id' }
  },
  templateId: { 
    type: DataTypes.UUID,
    references: { model: 'Templates', key: 'id' }
  },
  patientName: { type: DataTypes.STRING, allowNull: true },
  content: { type: DataTypes.JSON, allowNull: false },
  rawContent: { type: DataTypes.TEXT('long'), allowNull: true },
  conversationContent: { type: DataTypes.JSON, allowNull: true },
});

module.exports = Transcript;
