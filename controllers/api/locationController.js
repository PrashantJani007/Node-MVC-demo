const Location = require('../../models').Location;
const Station = require('../../models').Station;
const User = require('../../models').User;
const Plug = require('../../models').Plug;
const Network = require('../../models').Network;
const Amenity = require('../../models').Amenity;
const ParkingAttributes = require('../../models').ParkingAttributes;
const LocationAmenity = require('../../models').LocationAmenity;
const LocationParkingAttributes = require('../../models').LocationParkingAttributes;
const {locationValidation} = require('../../validations/api/locationValidation');
const sequelize = require('../../models').sequelize;
const {LOCATION_STATUS} = require('../../models/location');

const index = async(req,res)=>{
    
    try {
        var locations = await Location.findAll({
            where:{
                // user_id:req.user_id,
                status:LOCATION_STATUS.VERIFIED
            },
            attributes:['id','name','latitude','longitude']
        });  
        if(locations == null){
            locations = [];
        }
        return res.status(200).json({status:true,
            message:"All locations",
            data:locations
        });
    } catch (error) {
        return res.status(400).json({status:false,
            message:error.message,
        });        
    }
}

const store = async(req,res)=>{
    
    const t = await sequelize.transaction();
    try {
        const result = locationValidation(req.body);
        if(result.error){
            return res.status(422).json({status:false,message:result.error.message});
        }            
        const user_id = req.user_id;
        const {
            name,
            address,
            details,
            hours,
            price,
            phone_number,
            clearance_meter,
            parking_level,
            is_open,
            is_full_time,
            restricted_access,
            payment_required,
            plug_id,
            network_id,
            amenity_id,
            parking_attribute_id,
            latitude,
            longitude
        }=req.body
        
        if(plug_id.length != network_id.length){
            return res.status(400).json({status:false,message:"Something went wrong!"});
        }
        
        const locationData = {
            name,
            address,
            details,
            hours,
            price,
            phone_number,
            clearance_meter,
            parking_level,
            is_open,
            is_full_time,
            restricted_access,
            payment_required,
            user_id,
            latitude,
            longitude,
            status:LOCATION_STATUS.PENDING
        };
        
        const createLocation = await Location.create(locationData,{transaction:t});
        
        var stationData = [];
        
        for (let i = 0; i < plug_id.length; i++) {
            const obj = {
                plug_id:parseInt(plug_id[i]),
                network_id:parseInt(network_id[i]),
                location_id:parseInt(createLocation.id),
                status:LOCATION_STATUS.VERIFIED
            }   
            stationData.push(obj);
        }
        
        const createStation = await Station.bulkCreate(stationData,{transaction:t});
        
        var amenitiesData = [];
        
        for (let i = 0; i < amenity_id.length; i++) {
            const obj = {
                location_id:createLocation.id,
                amenity_id:parseInt(amenity_id[i])
            }
            amenitiesData.push(obj);
        }
        const createAmenities = await LocationAmenity.bulkCreate(amenitiesData,{transaction:t});
        
        var parkingData = [];
        
        for (let i = 0; i < parking_attribute_id.length; i++) {
            const obj = {
                location_id:createLocation.id,
                parking_attribute_id:parseInt(parking_attribute_id[i])
            }
            parkingData.push(obj);
        }
        
        const createParking = await LocationParkingAttributes.bulkCreate(parkingData,{transaction:t});
        const data = {id:createLocation.id,
            name:createLocation.name,
            latitude:createLocation.latitude,
            longitude:createLocation.longitude};
            await t.commit();
            return res.status(201).json({status:true,data,message:"Location successfully added!"});
        } catch (error) {
            await t.rollback();
            return res.status(400).json({status:false,message:error.message});
        }
    }
    
    const getPlugOptions = async(req,res)=>{
        
        var plugs = await Plug.findAll();
        if(plugs == null){
            plugs = [];
        }
        return res.status(200).json({status:true,data:plugs,message:'All Plugs'});
        
    }
    
    const getNetworkOptions = async(req,res)=>{
        
        var networks = await Network.findAll();
        if(networks == null){
            networks = [];
        }
        return res.status(200).json({status:true,data:networks,message:'All Networks'});
        
    }
    
    const getAmenitiesOptions = async(req,res)=>{
        
        var amenities = await Amenity.findAll();
        if(amenities == null){
            amenities = [];
        }
        return res.status(200).json({status:true,data:amenities,message:'All amenities'});
        
    }
    
    const getParkingOptions = async(req,res)=>{
        
        var parkings = await ParkingAttributes.findAll();
        if(parkings == null){
            parkings = [];
        }
        return res.status(200).json({status:true,data:parkings,message:'All Parking options'});
        
    }
    
    const show = async(req,res)=>{
        
        const id = req.params.id;
        
        try {
            
            var location = await Location.findOne({
                where:{
                    id:id,
                    status:LOCATION_STATUS.VERIFIED
                },
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
                }]
            });  
            if(location == null){
                location = [];
            }
            console.log(location);
            return res.status(200).json({status:true,data:location,message:"All locations"});
            
        } catch (error) {
            return res.status(400).json({status:false,message:error.message});
        }
        
    }
    
    const locationsByUser = async(req,res)=>{
        try {
            var locations = await Location.findAll({
                where:{
                    user_id:req.user_id,
                    status:LOCATION_STATUS.VERIFIED
                },
                attributes:['id','name','latitude','longitude']
            });  
            if(locations == null){
                locations = [];
            }
            return res.status(200).json({status:true,
                message:"All locations",
                data:locations
            });
        } catch (error) {
            return res.status(400).json({status:false,
                message:error.message,
            });        
        }
    }
    
    module.exports = {
        index,
        store,
        show,
        getPlugOptions,
        getNetworkOptions,
        getAmenitiesOptions,
        getParkingOptions,
        locationsByUser
    }