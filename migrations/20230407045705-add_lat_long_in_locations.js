'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return Promise.all([
      queryInterface.addColumn(
        'Locations',
        'latitude',
        Sequelize.DOUBLE(12,10)
        ),
        queryInterface.addColumn(
          'Locations',
          'longitude',
          Sequelize.DOUBLE(12,10)
          )
        ]);
      },
      
      async down (queryInterface, Sequelize) {
        return queryInterface.removeColumn(
          'Users',
          'image'
          );
        }
      };
      