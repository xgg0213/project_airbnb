'use strict';

const { query } = require('express');
const { ReviewImage } = require('../models');

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
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "sample review url: review 1",
      },
      {
        reviewId: 2,
        url: "sample review url: review 2",
      },
      {
        reviewId: 3,
        url: "sample review url: review 3",
        preview: true
      },
      {
        reviewId: 4,
        url: "sample review url: review 4",
      },
      {
        reviewId: 5,
        url: "sample review url: review 5",
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, [
      {
        reviewId: 1,
        url: "sample review url: review 1",
      },
      {
        reviewId: 2,
        url: "sample review url: review 2",
      },
      {
        reviewId: 3,
        url: "sample review url: review 3",
        preview: true
      },
      {
        reviewId: 4,
        url: "sample review url: review 4",
      },
      {
        reviewId: 5,
        url: "sample review url: review 5",
      },
    ], {})
  }
};
