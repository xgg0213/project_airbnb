'use strict';

const { SpotImage } = require('../models');

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
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: "sample spot url: spot 1 true",
      preview: true
    },
    {
      spotId: 1,
      url: "sample spot url: spot 1 false",
      preview: false
    },
    {
      spotId: 2,
      url: "sample spot url: spot 2 true",
      preview: true
    },
    {
      spotId: 2,
      url: "sample spot url: spot 2 false",
      preview: false
    },
    {
      spotId: 3,
      url: "sample review url: spot 3 true",
      preview: true
    },
    {
      spotId: 3,
      url: "sample review url: spot 3 false",
      preview: false
    },

   ], {validate:true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, [
      {
        spotId: 1,
        url: "sample spot url: spot 1 true",
        preview: true
      },
      {
        spotId: 1,
        url: "sample spot url: spot 1 false",
        preview: false
      },
      {
        spotId: 2,
        url: "sample spot url: spot 2 true",
        preview: true
      },
      {
        spotId: 2,
        url: "sample spot url: spot 2 false",
        preview: false
      },
      {
        spotId: 3,
        url: "sample review url: spot 3 true",
        preview: true
      },
      {
        spotId: 3,
        url: "sample review url: spot 3 false",
        preview: false
      },
    ], 
    {});
  }
};
