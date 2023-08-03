'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plug extends Model {
    
    static associate(models) {
      
    }
  }
  Plug.init({
    name:{
      type:DataTypes.STRING
    },
    image: {
      type:DataTypes.STRING,
      get(){
        const value = this.getDataValue('image');
        if(value != null){
          return '/storage/images/'+value;
        }else{
          return '/storage/images/blank.jpeg';
        }
      }
    },
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Plug',
    timestamps:false
  });
  return Plug;
};