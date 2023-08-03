'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.removeColumn(
      'Users',
      'last_name'
      );
      
    },
    
    async down (queryInterface, Sequelize) {
      
    }
  };
  