
const { User, Userinfo,Billing } = require("../../../config/db");

const bcrypt = require('bcrypt');

const moment = require('moment');


const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] },
            include: [{
            model: Userinfo,
            attributes: ['display_name','specialty','role','praction'],
          }] });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const getUserById = async (req, res) => {
    try {
        // const { id } = req.params;
        // const user = await User.findByPk(id, {
        //     attributes: { exclude: ["password"] }
        // });
        const userId =req.user.id;
  const user = await Userinfo.findOne({
  where: { user_id: userId },
  attributes: ['display_name','specialty','role','praction'],
  include: [{
    model: User,
    attributes: ['email','role']}]
});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updatePassword = async (req, res) => {

    try{
        // const user_id=req.user.id;
      const {id,password } = req.body;  
      const hashedPassword = await bcrypt.hash(password, 10);
      const updated = await User.update(
        { password:hashedPassword },
        { where: { id: id } }
      );
  
      
      res.status(201).json({ message : updated });
  
    }catch{
      res.status(500).json({ message : 'error updating password' });
    }
  }

const updateUser = async (req, res) => {
    
    try {
        const {id,display_name, email,specialty,role,praction } = req.body;
        await Userinfo.update(
            {display_name:display_name,specialty:specialty,role:role,praction:praction},
            { where: { user_id: id } }
        )
        const userInfo = await Userinfo.findOne({ where: { user_id: id } });
        if (userInfo && userInfo.user_id) {
            await User.update(
              { email: email },
              { where: { id: userInfo.user_id } }
            );
          }
    //   const user = await User.findByPk(id);
    //   if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    //   }
  
    //   // ✅ update User email
    //   if (email) user.email = email;
  
    //   // ✅ update Userinfo display_name
    //   const userinfo = await user.getUserinfo();
    //   if (userinfo && display_name) {
    //     userinfo.display_name = display_name;
    //     await userinfo.save();
    //   }
  
    //   await user.save();
  
      res.status(200).json({
        message: "User updated successfully"
      });
      
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const updateProfileUser = async (req, res) => {
    
    try {
        const userId = req.user.id;
        const {name, email,specialty,role,praction } = req.body;
        await Userinfo.update(
            {display_name:name,specialty:specialty,role:role,praction:praction},
            { where: { user_id: userId } }
        )
        const userInfo = await Userinfo.findOne({ where: { user_id: userId } });
        if (userInfo && userInfo.user_id) {
            await User.update(
              { email: email },
              { where: { id: userInfo.user_id } }
            );
          }
    //   const user = await User.findByPk(id);
    //   if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    //   }
  
    //   // ✅ update User email
    //   if (email) user.email = email;
  
    //   // ✅ update Userinfo display_name
    //   const userinfo = await user.getUserinfo();
    //   if (userinfo && display_name) {
    //     userinfo.display_name = display_name;
    //     await userinfo.save();
    //   }
  
    //   await user.save();
  
      res.status(200).json({
        message: "User Profile updated successfully"
      });
      
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
const addUsers  = async (req,res)=>{
    try{
const {name,specialty,role,praction,email} = req.body;
const existingUser = await User.findOne({ where: { email } });

if (existingUser) {
  return res.status(400).json({ emailerror: "Email already exists" });
}
 const newUser = await User.create({ email:email,status:'active' });
await Userinfo.create({
    user_id: newUser.id,          
    display_name:name,
    specialty:specialty,
    role:role,
    praction:praction
  });


  const {date} = req.body;
  const startMoment = moment.utc(date);
  const startDate = startMoment.local().format('YYYY-MM-DD HH:mm:ss');
  const endMoment = startMoment.clone().add(7, 'days');
  const endDate = endMoment.local().format('YYYY-MM-DD HH:mm:ss');
          const billing = await Billing.create({
              user_id: newUser.id,
              amount: "0",
              status: "active",
              payment_status: "paid",
              pakage_type: "trial",
              usage_limit: "3600",
              pakage_discription: "free trial",
              package_start_date: startDate,
              package_end_date: endDate
          });
  
res.status(200).json({
    message: "User added successfully",data:{billing}
  });
    }
    catch(error){
        res.status(500).json({ message: "Server error",error:error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} =req.params; 
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
//admin
const getAdminAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Userinfo,
                    as: 'profile', // Must match the alias defined in User.hasOne(Userinfo, { as: 'profile' })
                },
                {
                    model: Billing // No alias used in your association, so no 'as' needed
                }
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const isValidEmail = (email) => {
    // Basic RFC 5322 compliant regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isStrongPassword = (password) => {
    // Minimum 8 characters, one uppercase, one lowercase, one number, one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
};

const updateAdminUser = async (req, res) => {
    const { userId } = req.params;
    const { user, profile, billing } = req.body;

    try {
        // Check email format and uniqueness
        if (user?.email) {
            if (!isValidEmail(user.email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const existingUser = await User.findOne({ where: { email: user.email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({ message: "Email is already in use by another user" });
            }
        }

        // Check password strength
        if (user?.password && !isStrongPassword(user.password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character" });
        }

        // Update User table
        if (user) {
            const updatedUser = { ...user };

            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                updatedUser.password = await bcrypt.hash(user.password, salt);
            }

            await User.update(updatedUser, { where: { id: userId } });
        }

        // Update Userinfo (profile)
        if (profile) {
            const [profileRecord, created] = await Userinfo.findOrCreate({
                where: { user_id: userId },
                defaults: { ...profile, user_id: userId }
            });

            if (!created) {
                await profileRecord.update(profile);
            }
        }

        // Update Billing
        if (billing) {
            const [billingRecord, created] = await Billing.findOrCreate({
                where: { user_id: userId },
                defaults: { ...billing, user_id: userId }
            });

            if (!created) {
                await billingRecord.update(billing);
            }
        }

        res.status(200).json({ message: "User updated successfully" });

    } catch (error) {
        console.error("Admin update error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { getUsers,getUserById, updateUser, deleteUser,getAdminAllUsers ,updateAdminUser,updatePassword,addUsers,updateProfileUser };
