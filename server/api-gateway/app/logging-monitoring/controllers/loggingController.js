const { Logging_Monitoring,User,Userinfo,Op } = require("../../../config/db");
const moment = require('moment');

const createLogging = async (req, res) => {
  
  try{
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const userId = req.user.id;
      const  {date,activity}  = req.body;
      const formattedDate = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');

        const userdetails  = await User.findOne({
              where: { id: userId },
              attributes: ['role'],
            });
      const add =await Logging_Monitoring.create({
        user_id:userId,
        date:formattedDate,
        activity:activity,
        role:userdetails.role
      });
      
      return res.status(201).json({ message : add});

  }catch(error){
   return  res.status(500).json({ message: error.message });
  }
}
const getLoggingUsers = async (req, res) => {
    try {

      const logged = await Logging_Monitoring.findAll({
        
        include: [
          {
            model: User,
            attributes: ['email'],
            include: [{
              model: Userinfo,
              attributes: ['display_name']
            }]
          }
        ]
      });
    
        res.status(200).json(logged);
    }catch (error) {
      console.error(error); // Add this line
      res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports = { createLogging,getLoggingUsers };
