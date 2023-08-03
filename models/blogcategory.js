'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogCategory extends Model {
    
    static associate(models) {
      this.belongsTo(models.Blog,{foreignKey:'blog_id'});
      this.belongsTo(models.Category,{foreignKey:'category_id'});
    }
  }
  BlogCategory.init({
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model:'Categories',
        key: 'id'
      },
      allowNull: true,
      onDelete:"CASCADE"
    },
    blog_id: {
      type: DataTypes.INTEGER,
      references: {
        model:'Blogs',
        key: 'id'
      },
      allowNull: true,
      onDelete:"CASCADE"
    },
    
  }, {
    sequelize,
    modelName: 'BlogCategory',
    createdAt:'created_at',
    updatedAt:'updated_at'
  });
  return BlogCategory;
};