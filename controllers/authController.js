const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const maxAge = 30*24*3600;
const User = require('../models').User;

const{STATUS,ROLES} = require('../models/user');

const login = async(req,res) =>{
    const {email,password} = req.body;
    const getUser = await User.findOne({where:{email:email},attributes:['id','email','password']});
    if(!getUser){
        return res.status(400).json({status:false,error:"Please enter correct credentials!"});
    }
    const validatePassword = await bcrypt.compare(password,getUser.password);
    if(!validatePassword) return res.status(400).json({error:"Please enter correct credentials!"});
    const token  = jwt.sign({id:getUser.id,role:ROLES.ADMIN_ROLE},"SECRET");
    res.cookie('session',token,{expiresIn:maxAge});
    return res.status(200).json({status:true});
}

const logout = async (req,res)=>{
    res.clearCookie('session');
    res.redirect('/');
}

module.exports = {login,logout}