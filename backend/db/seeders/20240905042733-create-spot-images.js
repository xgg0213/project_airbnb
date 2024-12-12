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
      url: "https://images.pexels.com/photos/29720292/pexels-photo-29720292/free-photo-of-cozy-ragdoll-cat-relaxing-on-brass-shelf.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      preview: true
    },
    {
      spotId: 1,
      url: "https://images.pexels.com/photos/13304877/pexels-photo-13304877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      preview: false
    },
    {
      spotId: 1,
      url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      preview: false
    },
    {
      spotId: 1,
      url: "https://images.pexels.com/photos/3073694/pexels-photo-3073694.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 1,
      url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: true
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/1521305/pexels-photo-1521305.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/794590/pexels-photo-794590.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 2,
      url: "https://images.pexels.com/photos/3206572/pexels-photo-3206572.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 3,
      url: "https://images.pexels.com/photos/29228411/pexels-photo-29228411/free-photo-of-festive-cat-under-the-christmas-tree-in-ottawa.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: true
    },
    {
      spotId: 3,
      url: "https://images.pexels.com/photos/17685159/pexels-photo-17685159/free-photo-of-photo-of-a-domestic-bengal-cat.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 3,
      url: "https://images.pexels.com/photos/20186772/pexels-photo-20186772/free-photo-of-tabby-adorable-kitten.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 3,
      url: "https://images.pexels.com/photos/10908496/pexels-photo-10908496.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 3,
      url: "https://images.pexels.com/photos/10081245/pexels-photo-10081245.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 4,
      url: "https://images.pexels.com/photos/1571076/pexels-photo-1571076.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: true
    },
    {
      spotId: 4,
      url: "https://images.pexels.com/photos/1103904/pexels-photo-1103904.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 4,
      url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      preview: false
    },
    {
      spotId: 4,
      url: "https://images.pexels.com/photos/4750364/pexels-photo-4750364.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 4,
      url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 5,
      url: "https://images.pexels.com/photos/29720292/pexels-photo-29720292/free-photo-of-cozy-ragdoll-cat-relaxing-on-brass-shelf.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      preview: true
    },
    {
      spotId: 5,
      url: "https://images.pexels.com/photos/13304877/pexels-photo-13304877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      preview: false
    },
    {
      spotId: 5,
      url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      preview: false
    },
    {
      spotId: 5,
      url: "https://images.pexels.com/photos/3073694/pexels-photo-3073694.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 5,
      url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 6,
      url: "https://images.pexels.com/photos/29720292/pexels-photo-29720292/free-photo-of-cozy-ragdoll-cat-relaxing-on-brass-shelf.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      preview: true
    },
    {
      spotId: 6,
      url: "https://images.pexels.com/photos/13304877/pexels-photo-13304877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      preview: false
    },
    {
      spotId: 6,
      url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      preview: false
    },
    {
      spotId: 6,
      url: "https://images.pexels.com/photos/3073694/pexels-photo-3073694.jpeg?auto=compress&cs=tinysrgb&w=600",
      preview: false
    },
    {
      spotId: 6,
      url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
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
        url: "https://images.pexels.com/photos/29720292/pexels-photo-29720292/free-photo-of-cozy-ragdoll-cat-relaxing-on-brass-shelf.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: true
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/13304877/pexels-photo-13304877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: false
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        preview: false
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/3073694/pexels-photo-3073694.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: true
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/54632/cat-animal-eyes-grey-54632.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/1521305/pexels-photo-1521305.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/794590/pexels-photo-794590.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/3206572/pexels-photo-3206572.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/29228411/pexels-photo-29228411/free-photo-of-festive-cat-under-the-christmas-tree-in-ottawa.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/17685159/pexels-photo-17685159/free-photo-of-photo-of-a-domestic-bengal-cat.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/20186772/pexels-photo-20186772/free-photo-of-tabby-adorable-kitten.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/10908496/pexels-photo-10908496.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/10081245/pexels-photo-10081245.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/1571076/pexels-photo-1571076.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: true
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/1103904/pexels-photo-1103904.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/4750364/pexels-photo-4750364.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/29720292/pexels-photo-29720292/free-photo-of-cozy-ragdoll-cat-relaxing-on-brass-shelf.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: true
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/13304877/pexels-photo-13304877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/3073694/pexels-photo-3073694.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 5,
        url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/29720292/pexels-photo-29720292/free-photo-of-cozy-ragdoll-cat-relaxing-on-brass-shelf.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: true
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/13304877/pexels-photo-13304877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/13304875/pexels-photo-13304875.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/3073694/pexels-photo-3073694.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
      {
        spotId: 6,
        url: "https://images.pexels.com/photos/1653357/pexels-photo-1653357.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false
      },
    ], 
    {});
  }
};
