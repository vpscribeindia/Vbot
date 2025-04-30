const { EmailStatus,User,Userinfo,Op } = require("../../../config/db");
const nodemailer = require('nodemailer');
const createStatus = async (req, res) => {

  try{
    const  {date}  = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    
    const userId = req.user.id;

        const emailstatus = await EmailStatus.create({
          user_id:userId,
          date:date,
          status:'notsent'
        });
    res.status(201).json({ message : emailstatus });

  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

const updateStatus = async (req, res) => {

  try{

    const userId = req.user.id;
    const { status } = req.body;  
    const [updated] = await EmailStatus.update(
      { status },
      { where: { user_id: userId } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(201).json({ message : updated });

  }catch{
    res.status(500).json({ message : 'error updating status' });
  }
}
const useremailfind = async (req,res)=>{
  try{
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    const userId = req.user.id;

    const userInfo = await Userinfo.findOne({
      where: { user_id: userId },
      include: [{
        model: User,
        attributes: ['email'],
      }]
    });
    if (!userInfo || !userInfo.User) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(201).json({ email : userInfo });

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}

const getolddate = async(req,res) => {
  try{
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    const userId = req.user.id;
    const user = await EmailStatus.findOne({
      where: { user_id: userId },
      attributes: ['date'],
    });
    res.status(201).json({ date : user.date });

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }


}
const getuserid = async(req,res) => {
  try{
    const user = await EmailStatus.findOne({
      attributes: ['user_id'],
    });
    if (!user) {
      return res.status(200).json({ userid: null }); 
    }
    res.status(201).json({ userid : user.user_id });

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }


}

const getemailstatus = async(req,res) => {
  try{
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    const userId = req.user.id;
    const user = await EmailStatus.findOne({
      where: { user_id: userId },
      attributes: ['status'],
    });
    res.status(201).json({ status : user.status });

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }


}


const updatedate = async(req,res) => {
  try{
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }
    const userId = req.user.id;
 const { date,status } = req.body;  

 const [updated] = await EmailStatus.update(
  { date, status },
  { where: { user_id: userId } }
);

if (updated === 0) {
  return res.status(404).json({ message: 'User not found' });
}

    res.status(201).json({ message : updated });

  }
  catch(error){
    res.status(500).json({ message: error.message });
  }


}
const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;
    const email_user = process.env.EMAIL_USER;
    const email_pass = process.env.EMAIL_APP_PASS;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email_user,
        pass:email_pass,
      },
    });
  
    const mailOptions = {
      from: email_user,
      to,
      subject,
      text,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).send('Email sent');
    } catch (error) {
      res.status(500).send('Failed to send email');
    }
};
module.exports = { sendEmail,createStatus,useremailfind,updateStatus,getolddate,updatedate,getuserid,getemailstatus };