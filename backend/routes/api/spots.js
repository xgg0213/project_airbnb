// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const { Sequelize, fn, col } = require('sequelize');

const { setTokenCookie, restoreUser, requireAuth, validateAuthSpot, validateAuthNotSpot } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { handleValidationErrors,validateBookingId,validateSpotId,validateReviewId,validateSpotImageId,
    validateReviewImageId, validateReviewExists, validateBookingConflicts, validateIdNaN } = require('../../utils/validation');

const { check, query } = require('express-validator');

const router = express.Router();

// validate spot
const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({min: -90, max: 90})
      .withMessage('Latitude must be within -90 and 90'),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({min: -180, max: 180})
      .withMessage('Longitude must be within -180 and 180'),
    check('name')
      .exists({checkFalsy: true})
      .isLength({max:49})
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .exists({checkFalsy: true})
      .withMessage('Description is required'),
    check('price')
      .exists({checkFalsy: true})
      .isFloat({min:0})
      .withMessage('Price per day must be a positive number'),
    handleValidationErrors
  ];

// validate a review
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({min:1, max:5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

// validate params
const validateParams = [
  query('page')
    .optional()
    .isFloat({min:1})
    .withMessage('Page must be greater than or equal to 1'),
  query('size')
    .optional()
    .isFloat({min:1, max:20})
    .withMessage('Size must be between 1 and 20'),
  query('minLat')
    .optional()
    // .isDecimal()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Minimum latitude is invalid'),
  query('maxLat')
    .optional()
    .isDecimal()
    .isFloat({min: -90, max: 90})
    .withMessage('Maximum latitude is invalid'),
  query('minLng')
    .optional()
    // .isDecimal()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Minimum longitude is invalid'),
  query('maxLng')
    .optional()
    .isDecimal()
    .isFloat({min: -180, max: 180})
    .withMessage('Maximum longitude is invalid'),
  query('minPrice')
    .optional()
    // .isDecimal()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
  query('maxPrice')
    .optional()
    .isDecimal()
    .isFloat({min: 0})
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

// validate start & end dates for booking
const validateDates = [
    // Check if startDate exists and is not before today
    check('startDate')
      .exists({ checkFalsy: true })
      .custom((value) => {
        const today = new Date().setHours(0, 0, 0, 0);  // Set today's date without time
        const startDate = new Date(value).setHours(0, 0, 0, 0);
        if (startDate < today) {
            throw new Error('startDate cannot be in the past');
        }
        return true
      }),
  
    // Check if endDate exists and is not before or on the same day as startDate
    check('endDate')
      .exists({ checkFalsy: true })
      .custom((value, { req }) => {
        const startDate = new Date(req.body.startDate).setHours(0, 0, 0, 0);
        const endDate = new Date(value).setHours(0, 0, 0, 0);
        if (endDate <= startDate) {
          throw new Error('endDate cannot be on or before startDate');
        }
        return true;
      }),
    handleValidationErrors
];


// Get all spots: no login required
router.get(
    '/',
    validateParams,
    async (req, res) => {

      let {page=1, size=20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
      const where = {};
      const pagination = {};

      const pageN = parseInt(page, 10);
      const sizeN = parseInt(size, 10);
      const minLatN = parseFloat(minLat);
      const maxLatN = parseFloat(maxLat);
      const minLngN = parseFloat(minLng);
      const maxLngN = parseFloat(maxLng);
      const minPriceN = parseFloat(minPrice);
      const maxPriceN = parseFloat(maxPrice);

      // all valid params
      pagination.limit = sizeN;
      pagination.offset = sizeN * (pageN-1);

      // create where filters
      if (minLat || maxLat) {
        where.lat = {
          ...(minLat && { [Op.gte]: minLatN }),
          ...(maxLat && { [Op.lte]: maxLatN })
        };
      }

      if (minLng || maxLng) {
        where.lng = {
          ...(minLng && { [Op.gte]: minLngN }),
          ...(maxLng && { [Op.lte]: maxLngN })
        };
      }

      if (minPrice || maxPrice) {
        where.price = {
          ...(minPrice && { [Op.gte]: minPriceN }),
          ...(maxPrice && { [Op.lte]: maxPriceN })
        };
      }

      const spots = await Spot.findAll({
        where,
        include: [
          { 
            model: Review,
            attributes: [], // We don't need the full review data, just the average
            // subQuery: false,
            // duplicating: false,
          },
          {
            model: SpotImage,
            as: 'SpotImages',  // The alias defined in the association
            attributes: [],
            where: {preview: true},
            required: false
            // subQuery: false
            // separate: true,
          }
        ],
        attributes: {
          include: [
            [
              fn('ROUND', fn('AVG', col('Reviews.stars')), 1),
              //Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), // Aggregating the stars from Review
              'avgRating'  // Alias for the result
            ],
            [
              Sequelize.col('SpotImages.url'),
              "previewImage"
            ]
          ]
        },
        group: ['Spot.id', 'SpotImages.id'],  // Grouping by Spot.id to get avgRating for each spot
        ...pagination,
        subQuery: false
      });

      return res.status(200).json({
        Spots:spots,
        Page: pageN,
        Size: sizeN
      });
    }
);



// get spots for current user
router.get(
    '/current',
    requireAuth,
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
              model: SpotImage,
              as: 'SpotImages',  // The alias defined in the association
              attributes: [],
              where: {preview: true},
              required: false
            }
          ],
            attributes: {
              include: [
                [
                  fn('ROUND', fn('AVG', col('Reviews.stars')), 1), // Aggregating the stars from Review
                  'avgRating'  // Alias for the result
                ],
                [
                  col('SpotImages.url'),
                  "previewImage"
                ]
              ]
            },
            group: ['Spot.id', 'SpotImages.url']  // Grouping by Spot.id to get avgRating for each spot
        });
        return res.status(200).json({
          Spots: spots
        });
    }
)

// Get details of a Spot from an id
router.get(
    '/:spotId',
    validateIdNaN,
    validateSpotId,
    async(req, res) => {
        const spotId = req.params.spotId;

        const spots = await Spot.findAll({
          where: {id:spotId},
          include: [
           {
             model: Review,
             attributes: []  // We don't need the full review data, just the average
           },
           {
             model: SpotImage,
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
                    fn('COUNT', col('Reviews.id')), // Counting the # of Reviews 
                    'numReviews'  // Alias for the result
                ],
                [
                    fn('ROUND', fn('AVG', col('Reviews.stars')), 1), // Aggregating the stars from Review
                    'avgRating'  // Alias for the result
                ],
             ]
           },
           group: ['Spot.id', 'SpotImages.id', 'Owner.id'] 
       });

        // spot Id found
        
        return res.status(200).json(spots);
    }
);

// Create a Spot
router.post(
    '/',
    requireAuth,
    validateSpot,
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

        return res.status(201).json(newSpot);
    }
);

// Add an Image to a Spot based on the Spot's id
router.post(
    '/:spotId/images',
    requireAuth,
    validateIdNaN,
    validateSpotId,
    validateAuthSpot,
    async(req, res) => {
        const spotId = req.params.spotId;
        
        // spotId found & matching
        const {url, preview} = req.body;
        const newImage = await SpotImage.create({
            spotId: spotId,
            url,
            preview
        })

        return res.status(201).json({
            "id": newImage.id,
            "url": url,
            "preview": preview
        })

    }
);

// Edit a Spot
// const requireAuth = function (req, _res, next) {
//   if (req.user) return next();

//   const err = new Error('Authentication required');
//   err.title = 'Authentication required';
//   err.errors = { message: 'Authentication required' };
//   err.status = 401;
//   return next(err);
// };

// const validateIdNaN = (req, res, next) => {
//   const id = req.params.bookingId || req.params.spotId || req.params.reviewId || req.params.imageId
//   const numericId = Number(id);

//   if (!isNaN(numericId)) return next();

//   const err = new Error("couldn't be found");
//   err.title = "couldn't be found";
//   err.status = 404;
//   if (req.params.bookingId) err.message = "Booking couldn't be found";
//   if (req.params.reviewId) err.message = "Review couldn't be found";
//   if (req.params.spotId) err.message = "Spot couldn't be found";
//   if (req.originalUrl.includes('spot-images')) err.message = "Spot Image couldn't be found";
//   if (req.originalUrl.includes('review-images')) err.message = "Review Image couldn't be found"
  
//   return next(err);
// };

// const validateSpotId = async(req, res, next) => {
//   const spotId = req.params.spotId;
//   const updatedSpot = await Spot.findOne({
//       where: {id:+req.params.spotId},
//   });

//   if (updatedSpot) return next();

//   const err = new Error("Spot couldn't be found");
//     err.title = "couldn't be found";
//     err.errors = { message: "Spot couldn't be found" };
//     err.status = 404;
//     return next(err);
// };

// const validateAuthSpot = async (req, res, next) => {
//   const spotId = req.params.spotId;
//   const current = req.user.id
//   const spot = await Spot.findByPk(+req.params.spotId);

//   if (Number(current) === Number(spot.ownerId)) return next();

//   const err = new Error('Forbidden');
//   err.title = 'Forbidden';
//   err.errors = { message: 'Forbidden' };
//   err.status = 403;
//   return next(err);
// };

// const validateSpot = [
//   check('address')
//     .exists({ checkFalsy: true })
//     .withMessage('Street address is required'),
//   check('city')
//     .exists({ checkFalsy: true })
//     .withMessage('City is required'),
//   check('state')
//     .exists({ checkFalsy: true })
//     .withMessage('State is required'),
//   check('country')
//     .exists({ checkFalsy: true })
//     .withMessage('Country is required'),
//   check('lat')
//     .exists({ checkFalsy: true })
//     .isFloat({min: -90, max: 90})
//     .withMessage('Latitude must be within -90 and 90'),
//   check('lng')
//     .exists({ checkFalsy: true })
//     .isFloat({min: -180, max: 180})
//     .withMessage('Longitude must be within -180 and 180'),
//   check('name')
//     .exists({checkFalsy: true})
//     .isLength({max:49})
//     .withMessage('Name must be less than 50 characters'),
//   check('description')
//     .exists({checkFalsy: true})
//     .withMessage('Description is required'),
//   check('price')
//     .exists({checkFalsy: true})
//     .isFloat({min:0})
//     .withMessage('Price per day must be a positive number'),
//   handleValidationErrors
// ];

router.put(
    '/:spotId',
    requireAuth,
    validateIdNaN,
    validateSpotId,
    validateAuthSpot,
    // validateSpot,
    async (req, res) => {
      const spotId = req.params.spotId;

      // spotId not found
      const updatedSpot = await Spot.findOne({
        where: {id:spotId},
      });

    // spotId found && matching
      const {address, city, state, country, lat, lng, name, description, price} = req.body;

      // await updatedSpot.update({
      //     address: address?address:updatedSpot.address,
      //     city: city?city:updatedSpot.city,
      //     state: state?state:updatedSpot.state,
      //     country: country?country:updatedSpot.country,
      //     lat: lat?lat:updatedSpot.lat,
      //     lng: lng?lng:updatedSpot.lng,
      //     name: name?name:updatedSpot.name,
      //     description: description?description:updatedSpot.description,
      //     price: price?price:updatedSpot.price,
      // });

      const changes = {};

      if (address !== undefined && address !== updatedSpot.address) changes.address = address;
      if (city !== undefined && city !== updatedSpot.city) changes.city = city;
      if (state !== undefined && state !== updatedSpot.state) changes.state = state;
      if (country !== undefined && country !== updatedSpot.country) changes.country = country;
      if (lat !== undefined && lat !== updatedSpot.lat) changes.lat = lat;
      if (lng !== undefined && lng !== updatedSpot.lng) changes.lng = lng;
      if (name !== undefined && name !== updatedSpot.name) changes.name = name;
      if (description !== undefined && description !== updatedSpot.description) changes.description = description;
      if (price !== undefined && price !== updatedSpot.price) changes.price = price;

      // Only update if there are changes
      if (Object.keys(changes).length > 0) {
        await updatedSpot.update(changes);
      }

      return res.status(200).json(updatedSpot)
    }
)


// Delete a Spot
router.delete(
    '/:spotId',
    requireAuth,
    validateIdNaN,
    validateSpotId,
    validateAuthSpot,
    async(req, res) => {
      const spotId = req.params.spotId;

      // spotId found
      await Spot.destroy({
          where: {id:spotId}
      });

      return res.json({
          "message": "Successfully deleted"
      })
    }
);

/////////////////////////////////////////////////
// Reviews related

// Get all Reviews by a Spot's id
router.get(
  '/:spotId/reviews',
  validateIdNaN,
  validateSpotId,
  async(req, res) => {
      const spotId = req.params.spotId;

      // spot Id found
      const reviews = await Review.findAll({
         where: {spotId:spotId},
         include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: ReviewImage,
            as: 'ReviewImages',
            attributes: ['id', 'url']
          },
        ],
          group: ['Review.id', 'User.id', 'ReviewImages.id'] 
      });
      return res.status(200).json({
        Reviews: reviews
      });
  }
);

// Create a Review for a Spot based on the Spot's id
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateIdNaN,
  validateSpotId,
  validateReviewExists,
  validateReview,
  async(req, res) => {
      const spotId = Number(req.params.spotId);

      // with logged in user
      const userId = req.user.id;

      // spotId found
      const {review, stars} = req.body;
      const newReview = await Review.create({
          userId,
          spotId,
          review,
          stars
      })

      return res.status(201).json(newReview);

  }
);

/////////////////////////////////////////////////////////
// bookings related

// Get all bookings by a Spot's id
router.get(
  '/:spotId/bookings',
  requireAuth,
  validateIdNaN,
  validateSpotId,
  async(req, res) => {
      const spotId = req.params.spotId;
      const current = req.user.id;
      const spot = await Spot.findOne({
          where: {id:spotId}
      });
      const ownerId = Number(spot.ownerId);

      const bookingsUser = await Booking.findAll({
        where: {spotId},
        attributes: ['spotId', 'startDate', 'endDate'],
      });

      const bookingsOwner = await Booking.findAll({
        where: {spotId:spotId},
        include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        ],
        group: ['Booking.id', 'User.id'] 
      });
      
      // spot Id found & current user is not the owner
      if (ownerId !== Number(current)) {
        return res.status(200).json({
          Bookings: bookingsUser
        });
      } else {
        
        // spot Id found & current user is the owner

        // reordering the output
        const formattedBookings = bookingsOwner.map(booking => {
          const { User, ...bookingData } = booking.toJSON();  // Destructure the object to separate User and booking data
          return {
            User,             // Add User details first
            ...bookingData    // Spread the rest of the booking details afterward
          };
        });
        
        return res.status(200).json({
          bookings: formattedBookings
        });
      }
  }
);

// Create a Booking from a Spot based on the Spot's id
router.post(
  '/:spotId/bookings',
  requireAuth,
  validateIdNaN,
  validateSpotId,
  validateAuthNotSpot,
  validateDates,
  validateBookingConflicts,
  async(req, res) => {
      const spotId = req.params.spotId;
      const current = req.user.id;
      const {startDate, endDate} = req.body;
     
      // all requirements passed
      const newBooking = await Booking.create({
          spotId: spotId,
          userId: current,
          startDate,
          endDate,
      })

      return res.status(201).json(newBooking);
  }
);

module.exports = router;

