'use strict';
const {Booking} = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId:1,
        userId:2,
        startDate:'2024-01-01',
        endDate:'2024-01-03'
      },
      {
        spotId:2,
        userId:3,
        startDate:'2024-02-01',
        endDate:'2024-02-03'
      },
      {
        spotId:1,
        userId:4,
        startDate:'2024-03-01',
        endDate:'2024-03-03'
      },
      {
        spotId:1,
        userId:5,
        startDate:'2024-02-10',
        endDate:'2024-02-13'
      },
      {
        spotId:3,
        userId:5,
        startDate:'2024-04-01',
        endDate:'2024-04-03'
      }

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, [
      {
        spotId:1,
        userId:2,
        startDate:'2024-01-01',
        endDate:'2024-01-03'
      },
      {
        spotId:2,
        userId:3,
        startDate:'2024-02-01',
        endDate:'2024-02-03'
      },
      {
        spotId:1,
        userId:4,
        startDate:'2024-03-01',
        endDate:'2024-03-03'
      },
      {
        spotId:1,
        userId:5,
        startDate:'2024-02-10',
        endDate:'2024-02-13'
      },
      {
        spotId:3,
        userId:5,
        startDate:'2024-04-01',
        endDate:'2024-04-03'
      }
    ], 
    {});
  }
};
