'use strict';

const { Spot } = require('../models');

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
   await Spot.bulkCreate([
    {
      ownerId:1,
      address:"address1",
      city:"NYC",
      state:"NY",
      country:"USA",
      lat: 40.7128,
      lng: -74.0060,
      name:"name1",
      description:"sample spot description NYC 1",
      price: 100
    },
    {
      ownerId:2,
      address:"address2",
      city:"Paris",
      state:"Paris",
      country:"France",
      lat: 48.8566,
      lng: 2.3522,
      name:"name2",
      description:"sample spot description Paris 1",
      price: 110
    },
    {
      ownerId:3,
      address:"address3",
      city:"Tokyo",
      state:"Tokyo",
      country:"Japan",
      lat: 35.6762,
      lng: 139.6503,
      name:"name3",
      description:"sample spot description Tokyo 1",
      price: 120
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, [
      {
        ownerId:1,
        address:"address1",
        city:"NYC",
        state:"NY",
        country:"USA",
        lat: 40.7128,
        lng: -74.0060,
        name:"name1",
        description:"sample spot description NYC 1",
        price: 100
      },
      {
        ownerId:2,
        address:"address2",
        city:"Paris",
        state:"Paris",
        country:"France",
        lat: 48.8566,
        lng: 2.3522,
        name:"name2",
        description:"sample spot description Paris 1",
        price: 110
      },
      {
        ownerId:3,
        address:"address3",
        city:"Tokyo",
        state:"Tokyo",
        country:"Japan",
        lat: 35.6762,
        lng: 139.6503,
        name:"name3",
        description:"sample spot description Tokyo 1",
        price: 120
      }
    ], 
    {});
  }
};
