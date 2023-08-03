'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model:'Users',
          key: 'id'
        },
        allowNull: true,
        onDelete:"CASCADE"
      },
      name:{
        type:Sequelize.STRING(100)
      },
      address:{
        type:Sequelize.STRING
      },
      details:{
        type:Sequelize.STRING 
      },
      hours:{
        type:Sequelize.STRING
      },
      phone_number:{
        type:Sequelize.STRING(14)
      },
      price:{
        type:Sequelize.DOUBLE
      },
      clearance_meter:{
        type:Sequelize.STRING
      },
      parking_level:{
        type:Sequelize.TINYINT
      },
      is_open:{
        type:Sequelize.BOOLEAN,
      },
      is_full_time:{
        type:Sequelize.BOOLEAN,
      },
      restricted_access:{
        type:Sequelize.BOOLEAN,
      },
      payment_required:{
        type:Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Locations');
  }
};