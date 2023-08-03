'use strict';
const {
  Model
} = require('sequelize');

const STATUS_ACTIVE = 1;
const STATUS_INACTIVE = 0;
const STATUS_PENDING = 2;

const USER_ROLE = 0;
const ADMIN_ROLE = 1;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Location,{foreignKey:'user_id'})
    }
  }
  User.init({
    role:{
      type:DataTypes.TINYINT
    },
    first_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique:true
    },
    password: {
      type: DataTypes.STRING
    },
    postal_code:{
      type:DataTypes.STRING
    },
    country:{
      type:DataTypes.STRING
    },
    about_me:{
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.TINYINT
    },
    image:{
      type:DataTypes.STRING,
      get(){
        const value = this.getDataValue('image');
        if(value != null){
          return '/storage/images/users/'+value;
        }else{
          return '/storage/images/blank.jpeg';
        }
      }
    },
    
  }, {
    scopes: {
      removePassword: {
        attributes:{
          exclude:['password']
        }
      },
    },
    sequelize,
    modelName: 'User',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return User;
};
module.exports.STATUS = {STATUS_ACTIVE,STATUS_INACTIVE,STATUS_PENDING};
module.exports.ROLES = {USER_ROLE,ADMIN_ROLE};