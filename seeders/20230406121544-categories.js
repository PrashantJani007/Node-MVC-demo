'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.bulkInsert('Categories',[
      {
        name:'Science'
      },
      {
        name:'Technology'
      },
      {
        name:'Charging'
      },
    ]);
    
  },
  
  async down (queryInterface, Sequelize) {
    
  }
};
