const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ROLES, STATUS } = require('../../models/user');
const maxAge = 30*24*3600;
const User = require('../../models').User;
const {authValidation} = require('../../validations/api/authValidation');

const register = async(req,res)=>{
    
    try {
        const {first_name,email,password} = req.body;
        const result = authValidation(req.body);
        if(result.error){
            return res.status(422).json({status:false,code:422,message:result.error.message});
        }
        const checkEmail = await User.findOne({where:{email,role:ROLES.USER_ROLE}});
        if(checkEmail != undefined){
            return res.status(422).json({status:false,code:422,message:"Email already exists!"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        
        req.body.password = hashPassword;
        req.body.role = ROLES.USER_ROLE;
        req.body.status = STATUS.STATUS_ACTIVE;
        const user = await User.create(req.body);    
        const userData = await User.scope('removePassword').findOne({where:{id:user.id}});
        return res.status(201).json({status:true,code:201,message:"User register successfully!",data:userData});

    } catch (error) {
        return res.status(400).json({status:false,code:400,message:error.message})        
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const getUser = await User.findOne({where:{email:email,role:ROLES.USER_ROLE},attributes:['id','email','password']});
        if(!getUser){
            return res.status(400).json({status:false,message:"Please enter correct credentials!"});
        }
        const validatePassword = await bcrypt.compare(password,getUser.password);
        if(!validatePassword) return res.status(400).json({status:false,message:"Please enter correct credentials!"});
        const token  = jwt.sign({id:getUser.id,role:ROLES.ADMIN_ROLE},"SECRET",{expiresIn:'1m'});
        const refreshToken = jwt.sign({id:getUser.id,role:ROLES.ADMIN_ROLE},"REFRESHTOKEN",{expiresIn:'30d'})
        const userData = await User.scope('removePassword').findOne({where:{id:getUser.id}});
        return res.status(200).json({status:true,data:{userData,token,refreshToken},message:"Logged In"});    
    } catch (error) {
        return res.status(400).json({status:false,message:error.message});        
    }
}

module.exports = {register,login}