'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Station extends Model {
    
    static associate(models) {
      this.belongsTo(models.Location,{foreignKey:'location_id'});
      this.belongsTo(models.Plug,{foreignKey:'plug_id'});
      this.belongsTo(models.Network,{foreignKey:'network_id'});
    }
  }
  Station.init({
    location_id: {
      type: DataTypes.INTEGER,
      references: {
        model:'Locations',
        key: 'id'
      },
      allowNull: true,
      onDelete:"CASCADE"
    },
    plug_id:{
      type:DataTypes.INTEGER,
      references: {
        model:'Plugs',
        key: 'id'
      },
      allowNull: true,
      onDelete:"CASCADE"
    },
    network_id:{
      type:DataTypes.INTEGER,
      references: {
        model:'Networks',
        key: 'id'
      },
      allowNull: true,
      onDelete:"CASCADE"
    },
  }, {
    sequelize,
    modelName: 'Station',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return Station;
};