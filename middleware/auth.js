const jwt = require('jsonwebtoken');
const {ROLES} = require('../models/user');
const User = require('../models').User;

async function auth(req,res,next){
    // if(req.cookies == undefined){
    //     res.redirect('/');
    // }
    const token = req.cookies.session;        
    
    if(token == undefined) return res.redirect('/');
    
    const verified = jwt.verify(token,'SECRET');
    if(verified){
        const userRole = await User.findOne({where:{
            id:verified.id,
            role:ROLES.ADMIN_ROLE
        }});
        
        if(userRole){
            req.user_id = verified.id
            next();
        }
        else{
            res.clearCookie('session');
            res.redirect('/')
        }
    }else{
        res.redirect('/');
    }
}

module.exports = auth;