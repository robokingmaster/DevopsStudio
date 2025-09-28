const logger = require('../config/logger');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { Users } = require('../models');

// UserInfo Operations
exports.getUsers = async (req, res) => {
  const users = await Users.findAll();
  res.json(users);
};

exports.getUserByID = async (req, res) => {    
  const users = await Users.findByPk(req.params.loginid);
  res.json(users);
};

exports.updateUserByID = async (req, res) => {
  try {
    const loginid = req.params.loginid.toString(); 
    logger.debug(`Updating user information for loginid => ${loginid}`);
    const updateFields = req.body;
    
    const profilePic = req.file ? req.file.filename : null;
    
    if(updateFields.password) {
      logger.info(`✅ Updating user login password`);      
      const hashedPassword = await bcrypt.hash(updateFields.password, 10);      
      updateFields.password = hashedPassword;
    }

    console.log(profilePic)
    if (profilePic) {
      logger.info('⚙️  Updating user profile image');      
      const oldFilePath = req.file.path;
      logger.debug(`Old file name => ${oldFilePath}`)
      const fileExtention = path.extname(req.file.originalname);
      logger.debug(`New file extention => ${fileExtention}`);
      const newFileName = `profile-${loginid}${fileExtention}`
      logger.debug(`New file name => ${newFileName}`);
      const newFilePath = path.join('uploads', newFileName);
      logger.debug(`New file path => ${newFilePath}`);
      // Rename the file      
      
      fs.renameSync(oldFilePath, newFilePath);
      // Optionally update user record with image path
      updateFields.profile_image = newFileName;

      logger.info(`✅ Updated profile picture updated with ${newFilePath}`);
    }

    const [updatedRowsCount, updatedRows] = await Users.update(updateFields, {
      where: { loginid },
      returning: true, // returns updated rows (Postgres only)
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    logger.info(`✅ Updated user information for loginid => ${loginid} successfully`);
    return res.status(200).json({
      message: 'User information updated successfully',
      data: updatedRows[0], // return the updated user
    });    

  } catch (err) {
    logger.error('❌ Error updating user:', err.message);
    logger.trace(`Trace => ${err}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUserByID = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.loginid);
    if (!user) {      
      logger.info('⚠️ No User Found With Email => '+loginid+' !');
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile picture from uploads folder
    if (user.profilepic) {
      const filePath = path.join(__dirname, '..', 'uploads', user.profilepic);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }       
    }
    await user.destroy();
    console.log('✅ User deleted successfully');
    res.json({ message: 'User deleted' }); 
  }catch (err) {
    logger.error('❌ Error updating user:', err.message);
    logger.trace(`Trace => ${err}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

