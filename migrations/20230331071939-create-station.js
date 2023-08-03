'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model:'Locations',
          key: 'id'
        },
        allowNull: true,
        onDelete:"CASCADE"
      },
      plug_id:{
        type:Sequelize.INTEGER,
        references: {
          model:'Plugs',
          key: 'id'
        },
        allowNull: true,
        onDelete:"CASCADE"
      },
      network_id:{
        type:Sequelize.INTEGER,
        references: {
          model:'Networks',
          key: 'id'
        },
        allowNull: true,
        onDelete:"CASCADE"
      },
      status:{
        type:Sequelize.TINYINT,
        comment:"Verified = 1, Closed = 0,Coming Soon = 2,Pending = 3"
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stations');
  }
};