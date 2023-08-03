const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models').User;
const {ROLES, STATUS}  = require('../models/user');
const { adminValidation } = require('../validations/adminValidation');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const index = async(req,res)=>{
    
    if(req.xhr){
        
        var draw = parseInt(req.query.draw);
        var start = parseInt(req.query.start);
        var length = parseInt(req.query.length);
        var name = 'id';
        var dir = 'desc';
        
        if(req.query.order != undefined){
            var order = req.query.order;
            column = order[0].column;
            var name = req.query.columns[column].name;
            dir = req.query.order[0].dir;
        }
        
        var search_value = req.query.search['value'];
        
        var usersCount = await User.count({
            // offset:start,
            // limit:length,
            where:{
                role:{
                    [Op.not]:ROLES.ADMIN_ROLE
                },
                [Op.or]:[
                    {
                        first_name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        country: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    // {
                    //     postal_code: {
                    //         [Op.like]: `%${search_value}%`
                    //     }
                    // },
                ]   
            },
            attributes:['id','first_name','last_name','email','country','role','status'],
            order:[[name,dir]]
        });
        
        var users = await User.findAll({
            offset:start,
            limit:length,
            where:{
                role:{
                    [Op.not]:ROLES.ADMIN_ROLE
                },
                [Op.or]:[
                    {
                        first_name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        country: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    // {
                    //     postal_code: {
                    //         [Op.like]: `%${search_value}%`
                    //     }
                    // },
                    // {
                    //     role: {
                    //         [Op.like]: `%${search_value}%`
                    //     }
                    // },
                ]   
            },
            attributes:['id','first_name','last_name','email','country','role','status','image'],
            order:[[name,dir]]
        });
        var output = {
            'draw' : draw,
            'recordsTotal' : usersCount,
            'recordsFiltered' : usersCount,
            'data' : users
        };
        
        return res.json(output);
    }
    res.render('users',{data:req,title:'Users'});
}

const updateStatus = async(req,res)=>{
    
    try {
        const id = req.params.id;
        const getUser = await User.findOne({where:{id}});
        if(getUser.status == STATUS.STATUS_ACTIVE || getUser.status == STATUS.STATUS_INACTIVE){
            var status = '';
            var message = '';
            if(getUser.status == STATUS.STATUS_ACTIVE){
                status = STATUS.STATUS_INACTIVE;
                message = 'User de-activated successfully!';
            }else if(getUser.status == STATUS.STATUS_INACTIVE){
                status = STATUS.STATUS_ACTIVE;
                message = 'User activated successfully!';
            }
            
            const updateUser = await User.update({status},{where:{id}});
            return res.status(200).json({status:true,message});
        }else{
            return res.status(400).json({status:false,error:"Something went wrong!"});
        }    
    } catch (error) {
        return res.status(400).json({status:false,error:error.message});        
    }
}

const show = async(req,res)=>{
    
    const id = req.params.id;
    
    var user = await User.scope('removePassword').findOne({where:{id,role:ROLES.USER_ROLE}});
    return res.status(200).json({status:true,data:user,message:'Single User'});
    
}

const destroy = async(req,res)=>{
    
    const id = parseInt(req.params.id);
    
    const deleteUser = await User.destroy({where:{id}});
    if(deleteUser != 1){
        return res.status(400).json({status:false,error:"Something went wrong!"});
    }
    return res.status(200).json({status:true,message:"User deleted successfully!"});
}

const editAdminProfile = async(req,res)=>{
    
    const user = await User.findOne({where:{id:req.user_id,role:ROLES.ADMIN_ROLE},attributes:{exclude:['password']}});    
    res.render('profile',{data:req,title:"Profile",user})
    
}

const updateAdminProfile = async(req,res)=>{
    
    try {
        const result = adminValidation(req.body);
        if(result.error){
            return res.status(422).json({status:false,error:result.error.message});
        }
        const id = req.user_id;
        var {
            first_name,
            image,
            email,
            password
        } = req.body
        
        var data = {
            id,
            first_name,
            email
        }
        
        if(image != 'undefined' && image != ''){
            
            var dir = './storage/images/users'
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }  
            
            //Image Upload
            if(image != undefined && image != ''){
                var imageType = image.substring(
                    image.indexOf("/") + 1, 
                    image.lastIndexOf(";")
                    );
                    
                    if(imageType != "png" && imageType != "jpeg" && imageType != "jpg" && imageType != "gif"){
                        return res.status(422).json({status:true,error:'Image format not supported!'});
                    }
                    
                    var imageName = Date.now().toString()+"."+imageType;
                    
                    var base64Data = req.body.image.replace(/^data:image\/[a-z]+;base64,/, "");
                    await fs.writeFile(path.join(__dirname,'../storage/images/users',imageName), base64Data, 'base64', function(err) {
                        console.log(err,'image');
                    });
                    data.image = imageName;
                }
                
                //remove existing image code
                if(id != '' && image != undefined && image != ''){
                    const getUserImage = await User.findOne({where:{id},
                        attributes:['id','image'],
                        raw:true
                    });
                    console.log(getUserImage.image);
                    if(getUserImage.image != null){
                        fs.unlinkSync(process.cwd()+"/storage/images/users/"+getUserImage.image);
                        await User.update({image:null},{where:{id}});
                    }
                }
            }
            
            
            
            if(password != "undefined" && password != ''){
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt);
                data.password = hashPassword;
            }
            
            const updateUser = await User.update(data,{where:{id}});
            return res.status(200).json({status:true,message:"Profile updated successfully!"});
            
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});    
        }
        
    }
    
    const checkDuplicateEmail = async(req,res)=>{
        
        const checkEmail = await User.findOne({where:{email:req.body.email}});
        const id  = req.body.id;
        if(checkEmail){
            if(id != undefined && id == checkEmail.id){
                return res.send("true");
            }else{
                return res.send("false");
            }
        }else{
            return res.send('true');
        }
    }    
    
    const multipleDelete = async(req,res)=>{
        try {
            const ids = req.body.ids
            const deleteUsers = await User.destroy({where:{id:ids}});
            return res.status(200).json({status:true,message:'Data deleted successfully!'});
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});
        }
    }
    
    module.exports = {index,
        updateStatus,
        destroy,
        editAdminProfile,
        updateAdminProfile,
        checkDuplicateEmail,
        show,
        multipleDelete
    }