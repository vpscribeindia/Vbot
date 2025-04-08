const sequelize = require('./config/sequelize');
const File = require('./models/file');
const Transcript = require('./models/transcript');

const db = { sequelize, File, Transcript };

async function initializeDatabase() {
  try {
    File.hasOne(Transcript, { foreignKey: 'fileId' });
    Transcript.belongsTo(File, { foreignKey: 'fileId' });

    await sequelize.authenticate();
    console.log("✅ Database connection established successfully!");
    await sequelize.sync({ alter: true });
    console.log("✅ Database & tables created!");

  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); 
  }
}

initializeDatabase();

module.exports = db;
