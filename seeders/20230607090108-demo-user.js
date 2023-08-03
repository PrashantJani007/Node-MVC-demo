'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin',salt);
    return queryInterface.bulkInsert('Users',[
      {
        role:1,
        first_name:'admin',
        email:'admin@admin.com',
        password:hash,
        created_at: new Date(),
        updated_at: new Date(),
      }
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
