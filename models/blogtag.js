'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogTag extends Model {
 
    static associate(models) {
      this.belongsTo(models.Blog,{foreignKey:'blog_id'});
      this.belongsTo(models.Tags,{foreignKey:'tag_id'});
    }
  }
  BlogTag.init({
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model:'Tags',
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
    modelName: 'BlogTag',
    createdAt:'created_at',
    updatedAt:'updated_at'
  });
  return BlogTag;
};