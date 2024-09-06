// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, Image } = require('../../db/models');
// const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// validate login
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

// Get all spots: no login required
router.get(
    '/',
    async (req, res) => {
      const spots = await Spot.findAll({
        include: [
          {
            model: Review,
            attributes: []  // We don't need the full review data, just the average
          },
          {
            model: Image,
            as: 'SpotImages',  // The alias defined in the association
            attributes: []
          }
        ],
          attributes: {
            include: [
              [
                fn('AVG', col('Reviews.stars')), // Aggregating the stars from Review
                'avgRating'  // Alias for the result
              ],
              [
                col('SpotImages.url'),
                "previewImage"
              ]
            ]
          },
          group: ['Spot.id']  // Grouping by Spot.id to get avgRating for each spot
      });
      return res.json(spots);
    }
);

// get spots for current user
router.get(
    '/current',
    // validateLogin, // do I need this here?
    async(req, res) => {
        const current = req.user.id;
        const spots = await Spot.findAll({
           where: {ownerId:current},
           include: [
            {
              model: Review,
              attributes: []  // We don't need the full review data, just the average
            },
            {
              model: Image,
              as: 'SpotImages',  // The alias defined in the association
              attributes: []
            }
          ],
            attributes: {
              include: [
                [
                  fn('AVG', col('Reviews.stars')), // Aggregating the stars from Review
                  'avgRating'  // Alias for the result
                ],
                [
                  col('SpotImages.url'),
                  "previewImage"
                ]
              ]
            },
            group: ['Spot.id']  // Grouping by Spot.id to get avgRating for each spot
        });
        return res.json(spots);
    }
)

// Get details of a Spot from an id
router.get(
    '/:spotId',
    async(req, res) => {
        const spotId = req.params.spotId;

        // spotId not found
        const ids = await Spot.findAll({
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(spotId))) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spot Id found
        const spots = await Spot.findAll({
           where: {id:spotId},
           include: [
            {
              model: Review,
              attributes: []  // We don't need the full review data, just the average
            },
            {
              model: Image,
              as: 'SpotImages',
              attributes: ['id', 'url', 'preview']
            },
            {
              model: User,
              as: 'Owner',
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
            attributes: {
              include: [
                [
                  fn('AVG', col('Reviews.stars')), // Aggregating the stars from Review
                  'avgRating'  // Alias for the result
                ],
                [
                  fn('COUNT', col('Reviews.id')), // Counting the # of Reviews
                  'numReviews'  // Alias for the result
                ]
              ]
            },
            group: ['Spot.id'] // is this necessary?
        });
        return res.json(spots);
    }
);

// Create a Spot
router.post(
    '/',
    // validateLogin,
    async(req, res) => {
        const ownerId = req.user.id;
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        const newSpot = await Spot.create({
            ownerId,
            address,
            city, 
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        return res.json(newSpot);
    }
);

// Add an Image to a Spot based on the Spot's id
router.post(
    '/:spotId/images',
    async(req, res) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        // spotId not found
        const ids = await Spot.findAll({
            where: {ownerId: userId},
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(spotId))) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spotId found
        const {url, preview} = req.body;
        const newImage = await Image.create({
            imageableId: spotId,
            imageableType: 'Spot',
            url,
            preview
        })

        return res.json({
            "id": newImage.imageableId,
            "url": url,
            "preview": preview
        })

    }
)

// Edit a Spot
router.put(
    '/:spotId',
    async (req, res) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        // spotId not found
        const ids = await Spot.findAll({
            where: {ownerId: userId},
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(spotId))) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spotId found
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        const updatedSpot = await Spot.findOne({
            where: {id: spotId}
        });

        await updatedSpot.update({
            address: address?address:updatedSpot.address,
            city: city?city:updatedSpot.city,
            state: state?state:updatedSpot.state,
            country: country?country:updatedSpot.country,
            lat: lat?lat:updatedSpot.lat,
            lng: lng?lng:updatedSpot.lng,
            name: name?name:updatedSpot.name,
            description: description?description:updatedSpot.description,
            price: price?price:updatedSpot.price,
        });

        return res.json(updatedSpot)

    }
)

// Delete a Spot
router.delete(
    '/:spotId',
    async(req, res) => {
        const spotId = req.params.spotId;
        
        // spotId not found
        const ids = await Spot.findAll({
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(spotId))) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spotId found
        await Spot.destroy({
            where: {id:spotId}
        });

        return res.json({
            "message": "Successfully deleted"
        })
    }
)

module.exports = router;

