'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationParkingAttributes extends Model {
    static associate(models) {
      this.belongsTo(models.Location,{foreignKey:'location_id',onDelete:'CASCADE'});
      this.belongsTo(models.ParkingAttributes,{foreignKey:'parking_attribute_id',onDelete:'CASCADE'});
    }
  }
  LocationParkingAttributes.init({
    location_id: {
      type: DataTypes.INTEGER,
      references:{
        model:"Locations",
        key:"id"
      },
      allowNull:true,
      onDelete:'CASCADE'
    },
    parking_attribute_id: {
      type: DataTypes.INTEGER,
      references:{
        model:"ParkingAttributes",
        key:"id"
      }
    },
  }, {
    sequelize,
    modelName: 'LocationParkingAttributes',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return LocationParkingAttributes;
};