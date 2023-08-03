'use strict';
const {
  Model
} = require('sequelize');

const CLOSED = 0;
const VERIFIED = 1;
const COMING_SOON = 2;
const PENDING = 3;

const LOCATION_STATUS_NAME = {
  0:'Closed',
  1:'Verified',
  2:'Coming Soon',
  3:'Pending',
}

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    
    static associate(models) {
      this.belongsTo(models.User,{foreignKey:'user_id'})
      this.hasMany(models.Station,{foreignKey:'location_id'})
      this.hasMany(models.LocationAmenity,{foreignKey:'location_id'});
      this.hasMany(models.LocationParkingAttributes,{foreignKey:'location_id'});
    }
  }
  Location.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model:'Users',
        key: 'id'
      },
      allowNull: true,
      onDelete:"CASCADE"
    },
    name:{
      type:DataTypes.STRING(100)
    },
    address:{
      type:DataTypes.STRING
    },
    details:{
      type:DataTypes.STRING 
    },
    hours:{
      type:DataTypes.STRING
    },
    phone_number:{
      type:DataTypes.STRING(14)
    },
    price:{
      type:DataTypes.DOUBLE
    },
    clearance_meter:{
      type:DataTypes.STRING
    },
    parking_level:{
      type:DataTypes.TINYINT
    },
    is_open:{
      type:DataTypes.BOOLEAN,
    },
    is_full_time:{
      type:DataTypes.BOOLEAN,
    },
    restricted_access:{
      type:DataTypes.BOOLEAN,
    },
    payment_required:{
      type:DataTypes.BOOLEAN,
    },
    status:{
      type:DataTypes.TINYINT
    },
    latitude:{
      type:DataTypes.DOUBLE(12,10)
    },
    longitude:{
      type:DataTypes.DOUBLE(12,10)
    }
  }, {
    sequelize,
    modelName: 'Location',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return Location;
};

module.exports.LOCATION_STATUS = {VERIFIED,CLOSED,COMING_SOON,PENDING};
module.exports.LOCATION_VALUES = [0,1,2,3];
module.exports.LOCATION_STATUS_NAME = LOCATION_STATUS_NAME;