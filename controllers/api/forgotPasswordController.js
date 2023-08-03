const User = require('../../models').User;
const bcrypt = require('bcryptjs');

const changePassword = async(req,res)=>{
    
    const user_id = req.user_id;
    const{
        old_password,
        new_password
    } = req.body
    const user = await User.findOne({where:{id:user_id},attributes:['id','password']});
    const validatePassword = await bcrypt.compare(old_password,user.password);
    if(!validatePassword) return res.status(400).json({status:false,message:"Incorrect old password!"});
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.new_password,salt);

    const changePassword = await User.update({password:hashPassword},{where:{id:user_id}});
    return res.status(200).json({status:true,message:"Password changed successfully!"});
    
}

module.exports = {changePassword}