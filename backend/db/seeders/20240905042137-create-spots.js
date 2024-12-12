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
      ownerId: 1,
      address: "123 Kitty Lane",
      city: "New York",
      state: "NY",
      country: "USA",
      lat: 40.7128,
      lng: -74.0060,
      name: "Cozy Kitty Condo",
      description: "A purr-fectly cozy condo in NYC, complete with kitty-themed decor and a cat-friendly atmosphere.",
      price: 150
    },
    {
      ownerId: 2,
      address: "456 Catnip Street",
      city: "Paris",
      state: "Paris",
      country: "France",
      lat: 48.8566,
      lng: 2.3522,
      name: "Parisian Cat Haven",
      description: "A chic Parisian apartment designed with cat lovers in mind. Enjoy a relaxing stay with plenty of cat-themed amenities.",
      price: 200
    },
    {
      ownerId: 3,
      address: "789 Meow Avenue",
      city: "Tokyo",
      state: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lng: 139.6503,
      name: "Tokyo Cat Loft",
      description: "A modern Tokyo loft featuring playful cat murals and cozy nooks for relaxation. Perfect for feline enthusiasts.",
      price: 170
    },
    {
      ownerId: 4,
      address: "321 Paw Place",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      lat: 34.0522,
      lng: -118.2437,
      name: "Hollywood Cat Retreat",
      description: "Stay like a star in this Hollywood retreat with luxurious cat-inspired interiors and breathtaking city views.",
      price: 250
    },
    {
      ownerId: 5,
      address: "654 Feline Blvd",
      city: "London",
      state: "London",
      country: "United Kingdom",
      lat: 51.5074,
      lng: -0.1278,
      name: "British Cat Cottage",
      description: "A charming cottage in London filled with cat-themed charm and cozy comfort for a memorable stay.",
      price: 180
    },
    {
      ownerId: 6,
      address: "987 Whisker Way",
      city: "Sydney",
      state: "NSW",
      country: "Australia",
      lat: -33.8688,
      lng: 151.2093,
      name: "Sydney Cat Sanctuary",
      description: "A tranquil sanctuary in Sydney featuring feline-inspired decor and a peaceful atmosphere for a relaxing getaway.",
      price: 190
    },
    {
      ownerId: 1,
      address: "123 Purr Lane",
      city: "Melbourne",
      state: "VIC",
      country: "Australia",
      lat: -37.8136,
      lng: 144.9631,
      name: "Melbourne Cat Retreat",
      description: "An elegant retreat in Melbourne, designed with cat lovers in mind. This charming getaway offers cozy furnishings, unique feline-themed decor, and a tranquil ambiance that makes it perfect for relaxation. Located in a vibrant neighborhood, it provides easy access to Melbourne's renowned cafes, parks, and cultural attractions. Whether you're seeking a quiet escape or a luxurious base to explore the city, this retreat guarantees a memorable stay filled with comfort and whimsy.",
      price: 250
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
        ownerId: 1,
        address: "123 Kitty Lane",
        city: "New York",
        state: "NY",
        country: "USA",
        lat: 40.7128,
        lng: -74.0060,
        name: "Cozy Kitty Condo",
        description: "A purr-fectly cozy condo in NYC, complete with kitty-themed decor and a cat-friendly atmosphere.",
        price: 150
      },
      {
        ownerId: 2,
        address: "456 Catnip Street",
        city: "Paris",
        state: "Paris",
        country: "France",
        lat: 48.8566,
        lng: 2.3522,
        name: "Parisian Cat Haven",
        description: "A chic Parisian apartment designed with cat lovers in mind. Enjoy a relaxing stay with plenty of cat-themed amenities.",
        price: 200
      },
      {
        ownerId: 3,
        address: "789 Meow Avenue",
        city: "Tokyo",
        state: "Tokyo",
        country: "Japan",
        lat: 35.6762,
        lng: 139.6503,
        name: "Tokyo Cat Loft",
        description: "A modern Tokyo loft featuring playful cat murals and cozy nooks for relaxation. Perfect for feline enthusiasts.",
        price: 170
      },
      {
        ownerId: 4,
        address: "321 Paw Place",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        lat: 34.0522,
        lng: -118.2437,
        name: "Hollywood Cat Retreat",
        description: "Stay like a star in this Hollywood retreat with luxurious cat-inspired interiors and breathtaking city views.",
        price: 250
      },
      {
        ownerId: 5,
        address: "654 Feline Blvd",
        city: "London",
        state: "London",
        country: "United Kingdom",
        lat: 51.5074,
        lng: -0.1278,
        name: "British Cat Cottage",
        description: "A charming cottage in London filled with cat-themed charm and cozy comfort for a memorable stay.",
        price: 180
      },
      {
        ownerId: 6,
        address: "987 Whisker Way",
        city: "Sydney",
        state: "NSW",
        country: "Australia",
        lat: -33.8688,
        lng: 151.2093,
        name: "Sydney Cat Sanctuary",
        description: "A tranquil sanctuary in Sydney featuring feline-inspired decor and a peaceful atmosphere for a relaxing getaway.",
        price: 190
      },
      {
        ownerId: 1,
        address: "123 Purr Lane",
        city: "Melbourne",
        state: "VIC",
        country: "Australia",
        lat: -37.8136,
        lng: 144.9631,
        name: "Melbourne Cat Retreat",
        description: "An elegant retreat in Melbourne, designed with cat lovers in mind. This charming getaway offers cozy furnishings, unique feline-themed decor, and a tranquil ambiance that makes it perfect for relaxation. Located in a vibrant neighborhood, it provides easy access to Melbourne's renowned cafes, parks, and cultural attractions. Whether you're seeking a quiet escape or a luxurious base to explore the city, this retreat guarantees a memorable stay filled with comfort and whimsy.",
        price: 250
      }
    ], 
    {});
  }
};
