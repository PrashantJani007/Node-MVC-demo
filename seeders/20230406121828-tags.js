'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Tags',[
      {
        name:'Latest'
      },
      {
        name:'Popular'
      },
      {
        name:'Informative'
      },
    ]);
  },
  
  async down (queryInterface, Sequelize) {
    /**
    * Add commands to revert seed here.
    *
    * Example:
    * await queryInterface.bulkDelete('People', null, {});
    */
  }
};
