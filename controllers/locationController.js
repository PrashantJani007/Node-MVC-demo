const { Op } = require('sequelize');
const Location = require('../models').Location;
const Station = require('../models').Station;
const Plug = require('../models').Plug;
const Network = require('../models').Network;
const LocationAmenity = require('../models').LocationAmenity;
const Amenity = require('../models').Amenity;
const LocationParkingAttributes = require('../models').LocationParkingAttributes;
const ParkingAttributes = require('../models').ParkingAttributes;
const User = require('../models').User;
const sequelize = require('../models').sequelize;
const {LOCATION_STATUS,LOCATION_VALUES,LOCATION_STATUS_NAME} = require('../models/location');
// console.log(LOCATION_STATUS_NAME);
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
        
        var locationsCount = await Location.count({
            // offset:start,
            // limit:length,
            where:{
                [Op.or]:[
                    {
                        name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    // {
                    //     address: {
                    //         [Op.like]: `%${search_value}%`
                    //     }
                    // },
                    {
                        phone_number: {
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
            // attributes:['id','name','','email','country','role','status'],
            order:[[name,dir]]
        });
        
        var locations = await Location.findAll({
            offset:start,
            limit:length,
            where:{
                [Op.or]:[
                    {
                        name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        phone_number: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    
                ]   
            },
            attributes:['id',
            'name',
            'address',
            'phone_number',
            'is_full_time',
            'restricted_access',
            'payment_required',
            'status',
            // [sequelize.fn("COUNT", sequelize.col("Stations.location_id")), "total"],
        ],
        include: [
            {
                model: Station,
                attributes: [],
            },
        ],
        order:[[name,dir]],
        // group: ["Location.id"],  
    });
    
    var output = {
        'draw' : draw,
        'recordsTotal' : locationsCount,
        'recordsFiltered' : locationsCount,
        'data' : locations
    };
    
    return res.json(output);
    
}

res.render('locations',{data:req,title:'Locations'});
}

const changeOptionsStatus = async(req,res)=>{
    
    var id = req.params.id;
    var slug = req.params.slug;
    
    const location = await Location.findOne({where:{id}});
    
    switch (slug) {
        case 'full-time-status':
        var message = '';
        if(location.is_full_time == true){
            const update = await Location.update({is_full_time:false},{where:{id}});
            message='Open 24/7 status De-activated successfully!';
        }else{
            const update = await Location.update({is_full_time:true},{where:{id}});
            message='Open 24/7 status activated successfully!';
        }
        return res.status(200).json({status:true,message});
        break;
        case 'restricted-access-toggle':
        var message = '';
        if(location.restricted_access == true){
            const update = await Location.update({restricted_access:false},{where:{id}});
            message='Restricted access status De-activated successfully!';
        }else{
            const update = await Location.update({restricted_access:true},{where:{id}});
            message='Restricted access status activated successfully!';
        }
        return res.status(200).json({status:true,message});
        break;
        case 'payment-required-toggle':
        var message = '';
        if(location.payment_required == true){
            const update = await Location.update({payment_required:false},{where:{id}});
            message='Payment required status De-activated successfully!';
        }else{
            const update = await Location.update({payment_required:true},{where:{id}});
            message='Payment required status activated successfully!';
        }
        return res.status(200).json({status:true,message});
        break;
        default:
        return res.status(400).json({status:false,error:'Something went wrong!'});
        break;
    }
}

const changeStatus = async(req,res)=>{
    try {
        const id = parseInt(req.params.id);
        const status = parseInt(req.body.status);
        console.log(id,status);
        if(!LOCATION_VALUES.includes(status)){
            return res.status(400).json({status:true,error:'Something went wrong!'});
        }
        const updateStatus = await Location.update({status:status},{where:{id:id}});
        return res.status(200).json({status:true,message:'Status successfully changed!'}); 
    } catch (error) {
        return res.status(400).json({status:false,error:error.message})        
    }
}

const show = async(req,res)=>{
    
    try {
        const id = req.params.id;
        const location = await Location.findOne({
            where:{id},
            include:[{
                model:Station,
                attributes:{
                    exclude:['created_at','updated_at']
                },
                include:[{
                    model:Plug,
                    attributes:['id','name']
                },{
                    model:Network,
                    attributes:['id','name']
                }]
            },{
                model:LocationAmenity,
                attributes:{
                    exclude:['created_at','updated_at']
                },
                include:{
                    model:Amenity,
                    attributes:['id','name']
                }
            },{
                model:LocationParkingAttributes,
                attributes:{
                    exclude:['created_at','updated_at']
                },
                include:{
                    model:ParkingAttributes,
                    attributes:['id','name']
                }
            },{
                model:User,
                attributes:['id','first_name']
            }]
        });  
        
        var myStatus = LOCATION_STATUS_NAME[location.status];
        
        return res.status(200).json({status:true,data:location,myStatus});
    } catch (error) {
        return res.status(400).json({status:false,error:error.message});        
    }
    
    
    
}

const destroy = async(req,res)=>{
    
    try {
        const id = req.params.id;
        const deleteLocation = await Location.destroy({where:{id}});
        return res.status(200).json({status:true,message:'Location deleted successfully!'});
        
    } catch (error) {
        return res.status(400).json({status:false,error:error.message});        
    }
}

const multipleDelete = async(req,res)=>{
    try {
        const ids = req.body.ids
        const deleteLocations = await Location.destroy({where:{id:ids}});
        return res.status(200).json({status:true,message:'Data deleted successfully!'});
    } catch (error) {
        return res.status(400).json({status:false,error:error.message});
    }
}

module.exports = {index,changeOptionsStatus,changeStatus,show,destroy,multipleDelete}