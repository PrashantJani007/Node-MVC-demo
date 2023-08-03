const User = require('../models').User;
const {STATUS,ROLES} = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const hbs = require('nodemailer-express-handlebars')
const path = require('path');
const index = async(req,res)=>{
    res.render('forgotPassword/forgotPassword',{layout:'forgotPassword'});
}

const checkEmail = async(req,res)=>{
    
    const checkEmail = await User.findOne({where:{email:req.body.email,role:ROLES.ADMIN_ROLE}});
    if(checkEmail == undefined || checkEmail == null){
        return res.status(400).json({status:false,error:"Email not found!"});
    }
    
    const token  = jwt.sign({id:checkEmail.id,role:ROLES.ADMIN_ROLE},"SECRET",{expiresIn:'1m'});
    var link = "http://localhost:4000/forgot-password/verify-email?token="+token;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'noreplycraft@gmail.com',
            pass: 'ftlhvsncyustlsew',
        }
    });
    
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };
    
    transporter.use('compile', hbs(handlebarOptions));
    
    var mailOptions = {
        from: 'noreplycraft@gmail.com',
        // to: req.body.email,
        to: 'bhavik.test@mailinator.com',
        subject: 'Please verify your email',
        template: 'email',
        context:{
            first_name: checkEmail.first_name, // replace {{name}} with Adebola
            link
        }
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    
    return res.status(200).json({status:true,message:'Email verified! Please check your inbox'});
}

const showChangePassword = async(req,res)=>{
    try {
        const token = req.query.token;
        const verified = jwt.verify(token,'SECRET');   
        res.render('forgotPassword/changePassword',{layout:'forgotPassword/changePassword'})
    } catch (error) {
        // return res.status(400).json({status:false,error:"Link expired! Please try again."});        
        res.render('forgotPassword/linkExpired',{layout:'forgotPassword/linkExpired'})
    }
}

const changePassword = async(req,res)=>{
    
    try {
        const{password,token,password_confirmation} = req.body;

        if(password != password_confirmation){
            return res.status(422).json({status:false,error:"Confirmed password does not match!"});
        }

        const verified = jwt.verify(token,'SECRET');   
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const updatePassword = await User.update({password:hashPassword},{where:{id:verified.id}});

        return res.status(200).json({status:true,message:'Password updated successfully!'});
    } catch (error) {
        return res.status(400).json({status:false,error:'Something went wrong!'});        
    }
}

module.exports = {index,checkEmail,showChangePassword,changePassword}