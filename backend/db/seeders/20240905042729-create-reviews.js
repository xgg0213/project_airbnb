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
      userId: 2,
      spotId: 1,
      review: "The kitty condo was lovely, but I felt it could use a bit more light during the day.",
      stars: 4
    },
    {
      userId: 3,
      spotId: 2,
      review: "Absolutely loved the Parisian Cat Haven! Every detail was thoughtful and charming.",
      stars: 5
    },
    {
      userId: 4,
      spotId: 1,
      review: "The decor was adorable and the location perfect. Highly recommend for cat lovers!",
      stars: 5
    },
    {
      userId: 5,
      spotId: 2,
      review: "The place was decent but lacked some of the amenities promised in the listing.",
      stars: 3
    },
    {
      userId: 5,
      spotId: 3,
      review: "Tokyo Cat Loft exceeded my expectations! A wonderful experience for any feline fan.",
      stars: 5
    },
    {
      userId: 8,
      spotId: 6,
      review: "The Sydney Cat Sanctuary was okay, but it felt a bit outdated compared to the photos.",
      stars: 2
    },
    {
      userId: 9,
      spotId: 3,
      review: "Great location and beautifully designed space! Just a little noisy at night.",
      stars: 4
    },
    {
      userId: 9,
      spotId: 1,
      review: "Fantastic stay! The Cozy Kitty Condo was everything I hoped for and more.",
      stars: 5
    },
    {
      userId: 1,
      spotId: 4,
      review: "The place was a delightful retreat! Loved the peaceful ambiance and clean facilities. A minor improvement could be better Wi-Fi.",
      stars: 4
    },
    {
      userId: 1,
      spotId: 3,
      review: "Amazing stay! The host was incredibly welcoming, and the location was perfect for exploring the nearby attractions. Highly recommend this spot!",
      stars: 5
    },
    {
      userId: 6,
      spotId: 1,
      review: "The stay was delightful! The host was incredibly accommodating, and the location made it easy to visit nearby attractions. Highly recommend for anyone visiting the area.",
      stars: 5,
      createdAt: '2024-01-01T00:00:00.000Z', // ISO format for 2024-01-01
    },
    {
      userId: 8,
      spotId: 1,
      review: "This spot was fantastic! The host went above and beyond, and the neighborhood was peaceful with great amenities nearby.",
      stars: 5,
      createdAt: '2024-02-01T00:00:00.000Z', // ISO format for 2024-02-01
    },
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
        userId: 2,
        spotId: 1,
        review: "The kitty condo was lovely, but I felt it could use a bit more light during the day.",
        stars: 4
      },
      {
        userId: 3,
        spotId: 2,
        review: "Absolutely loved the Parisian Cat Haven! Every detail was thoughtful and charming.",
        stars: 5
      },
      {
        userId: 4,
        spotId: 1,
        review: "The decor was adorable and the location perfect. Highly recommend for cat lovers!",
        stars: 5
      },
      {
        userId: 5,
        spotId: 2,
        review: "The place was decent but lacked some of the amenities promised in the listing.",
        stars: 3
      },
      {
        userId: 5,
        spotId: 3,
        review: "Tokyo Cat Loft exceeded my expectations! A wonderful experience for any feline fan.",
        stars: 5
      },
      {
        userId: 8,
        spotId: 6,
        review: "The Sydney Cat Sanctuary was okay, but it felt a bit outdated compared to the photos.",
        stars: 2
      },
      {
        userId: 9,
        spotId: 3,
        review: "Great location and beautifully designed space! Just a little noisy at night.",
        stars: 4
      },
      {
        userId: 9,
        spotId: 1,
        review: "Fantastic stay! The Cozy Kitty Condo was everything I hoped for and more.",
        stars: 5
      },
      {
        userId: 1,
        spotId: 4,
        review: "The place was a delightful retreat! Loved the peaceful ambiance and clean facilities. A minor improvement could be better Wi-Fi.",
        stars: 4
      },
      {
        userId: 1,
        spotId: 3,
        review: "Amazing stay! The host was incredibly welcoming, and the location was perfect for exploring the nearby attractions. Highly recommend this spot!",
        stars: 5
      },
      {
        userId: 6,
        spotId: 1,
        review: "The stay was delightful! The host was incredibly accommodating, and the location made it easy to visit nearby attractions. Highly recommend for anyone visiting the area.",
        stars: 5,
        createdAt: '2024-01-01T00:00:00.000Z', // ISO format for 2024-01-01
      },
      {
        userId: 8,
        spotId: 1,
        review: "This spot was fantastic! The host went above and beyond, and the neighborhood was peaceful with great amenities nearby.",
        stars: 5,
        createdAt: '2024-02-01T00:00:00.000Z', // ISO format for 2024-02-01
      },

    ], 
    {});
  }
};
