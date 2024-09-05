'use strict';

const { Image } = require('../models');

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
   await Image.bulkCreate([
    {
      imageableId:1,
      imageType:"Review",
      url: "sample review url: review 1",
      preview: true
    },
    {
      imageableId:2,
      imageType:"Review",
      url: "sample review url: review 2",
      preview: false
    },
    {
      imageableId:3,
      imageType:"Spot",
      url: "sample review url: spot 1",
      preview: true
    }

   ], {validate:true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, [
      {
        imageableId:1,
        imageType:"Review",
        url: "sample review url: review 1",
        preview: true
      },
      {
        imageableId:2,
        imageType:"Review",
        url: "sample review url: review 2",
        preview: false
      },
      {
        imageableId:3,
        imageType:"Spot",
        url: "sample review url: spot 1",
        preview: true
      }
    ], 
    {});
  }
};
