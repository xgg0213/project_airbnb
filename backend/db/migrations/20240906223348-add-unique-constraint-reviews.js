'use strict';

let options = {};
options.tableName = 'Reviews';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addIndex(
      options,
      ['userId', 'spotId'],
      {
        unique: true,
        name: 'unique_userId_spotId',
      }
    , )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // options.tableName = "Reviews";
    await queryInterface.removeIndex(
      options, 
      'unique_userId_spotId'
    )
  }
};
