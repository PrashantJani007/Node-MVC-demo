'use strict';
const plugs = require('../static-json-data/plugs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.bulkInsert('Plugs',plugs);
    
  },
  
  async down (queryInterface, Sequelize) {
    
  }
};
