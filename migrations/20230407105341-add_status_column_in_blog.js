'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Blogs',
      'status',
      {
        type:Sequelize.TINYINT,
        comment:'0 = In-Active, 1 = Active'
      }
      );
    },
    
    async down (queryInterface, Sequelize) {
      return queryInterface.removeColumn(
        'Blogs',
        'status'
        );
      }
    };
    