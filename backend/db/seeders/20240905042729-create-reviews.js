'use strict';

const { Review } = require('../models');

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
   await Review.bulkCreate([
    {
      userId:2,
      spotId:1,
      review: "sample review left by user2 for spot1",
      stars:4
    },
    {
      userId:3,
      spotId:2,
      review:"sample review left by user3 for spot2",
      stars:5
    },
    {
      userId:4,
      spotId:1,
      review:"sample review left by user4 for spot1",
      stars:5
    },
    {
      userId:5,
      spotId:2,
      review:"sample review left by user5 for spot2",
      stars:3
    },
    {
      userId:5,
      spotId:3,
      review:"sample review left by user5 for spot3",
      stars:5
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, [
      {
        userId:2,
        spotId:1,
        review:"sample review left by user2 for spot1",
        stars:4
      },
      {
        userId:3,
        spotId:2,
        review:"sample review left by user3 for spot2",
        stars:5
      },
      {
        userId:4,
        spotId:1,
        review:"sample review left by user4 for spot1",
        stars:5
      },
      {
        userId:5,
        spotId:2,
        review:"sample review left by user5 for spot2",
        stars:3
      },
      {
        userId:5,
        spotId:3,
        review:"sample review left by user5 for spot3",
        stars:5
      }
    ], 
    {});
  }
};
