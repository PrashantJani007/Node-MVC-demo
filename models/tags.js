'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      this.hasMany(models.BlogTag,{foreignKey:'tag_id'});
    }
  }
  Tags.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tags',
    timestamps:false
  });
  return Tags;
};