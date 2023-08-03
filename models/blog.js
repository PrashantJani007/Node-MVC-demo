'use strict';
const {
  Model
} = require('sequelize');

const ACTIVE = 1;
const IN_ACTIVE = 0;

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      this.hasMany(models.BlogCategory,{foreignKey:'blog_id'});
      this.hasMany(models.BlogTag,{foreignKey:'blog_id'});
    }
  }
  Blog.init({
    image:{
      type: DataTypes.STRING,
      get(){
        const value = this.getDataValue('image');
        if(value != null){
          return '/storage/images/blogs/'+value;
        }else{
          return '/storage/images/blank.jpeg';
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      unique:true
    },
    description: {
      type: DataTypes.TEXT
    },
    visit_count: {
      type: DataTypes.INTEGER
    },
    status:{
      type:DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Blog',
    createdAt:'created_at',
    updatedAt:'updated_at'
  });
  return Blog;
};

module.exports.BLOG_STATUS = {ACTIVE,IN_ACTIVE}