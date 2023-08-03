'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BlogCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model:'Categories',
          key: 'id'
        },
        allowNull: true,
        onDelete:"CASCADE"
      },
      blog_id: {
        type: Sequelize.INTEGER,
        references: {
          model:'Blogs',
          key: 'id'
        },
        allowNull: true,
        onDelete:"CASCADE"
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
    await queryInterface.dropTable('BlogCategories');
  }
};