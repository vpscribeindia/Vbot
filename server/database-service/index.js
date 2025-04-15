const sequelize = require('./config/sequelize');
const File = require('./models/file');
const Transcript = require('./models/transcript');
const User = require('./models/user');
const Userinfo = require('./models/userInfo');
const Billing = require('./models/billing');


const db = { sequelize, File, Transcript, User, Userinfo, Billing };

async function initializeDatabase() {
  try {
    
    User.hasMany(File, { foreignKey: 'user_id' });
    File.belongsTo(User, { foreignKey: 'user_id' });
    
    User.hasMany(Billing, { foreignKey: 'user_id' });
    Billing.belongsTo(User, { foreignKey: 'user_id' });
    
    File.hasOne(Transcript, { foreignKey: 'fileId' });
    Transcript.belongsTo(File, { foreignKey: 'fileId' });
    
    User.hasOne(Userinfo, { foreignKey: 'user_id' });
    Userinfo.belongsTo(User, { foreignKey: 'user_id' });
    




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
