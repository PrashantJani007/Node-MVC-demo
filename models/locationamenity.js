'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationAmenity extends Model {
   
    static associate(models) {
      
      this.belongsTo(models.Location,{foreignKey:'location_id',onDelete:'CASCADE'});
      this.belongsTo(models.Amenity,{foreignKey:'amenity_id',onDelete:'CASCADE'});

    }
  }
  LocationAmenity.init({
    location_id: {
      type: DataTypes.INTEGER,
      references:{
        model:"Locations",
        key:"id"
      },
      allowNull:true,
      onDelete:'CASCADE'
    },
    amenity_id: {
      type: DataTypes.INTEGER,
      references:{
        model:"Amenities",
        key:"id"
      }
    },
  }, {
    sequelize,
    modelName: 'LocationAmenity',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return LocationAmenity;
};