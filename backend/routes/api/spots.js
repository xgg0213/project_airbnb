// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
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

      const {page=1, size=20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
      const where = {};
      const pagination = {}

      const pageN = parseInt(page, 10);
      const sizeN = parseInt(size, 10);
      const minLatN = parseFloat(minLat);
      const maxLatN = parseFloat(maxLat);
      const minLngN = parseFloat(minLng);
      const maxLngN = parseFloat(maxLng);
      const minPriceN = parseFloat(minPrice);
      const maxPriceN = parseFloat(maxPrice);


      // invalid req.query params]
      if (pageN<1 || sizeN<1 || sizeN>20 || maxLatN>90 ||minLatN<-90 ||maxLngN>180 ||minLngN<-180 ||minPriceN<0 || maxPriceN<0) {
        return res.status(400).json({
          "message": "Bad Request", 
          "errors": {
            "page": "Page must be greater than or equal to 1",
            "size": "Size must be between 1 and 20",
            "maxLat": "Maximum latitude is invalid",
            "minLat": "Minimum latitude is invalid",
            "minLng": "Maximum longitude is invalid",
            "maxLng": "Minimum longitude is invalid",
            "minPrice": "Minimum price must be greater than or equal to 0",
            "maxPrice": "Maximum price must be greater than or equal to 0"
          }
        })
      }

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
            attributes: [
              [
                Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), // Aggregating the stars from Review
                'avgRating'  // Alias for the result
              ]
            ], // We don't need the full review data, just the average
          },
          {
            model: SpotImage,
            as: 'SpotImages',  // The alias defined in the association
            attributes: []
          }
        ],
        // attributes: {
        //   include: [
        //     [
        //       Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), // Aggregating the stars from Review
        //       'avgRating'  // Alias for the result
        //     ],
        //     [
        //       Sequelize.col('SpotImages.url'),
        //       "previewImage"
        //     ]
        //   ]
        // },
        // group: ['Spot.id', 'SpotImages.id'],  // Grouping by Spot.id to get avgRating for each spot

        group: ['Spots.id'],
        ...pagination
      });
      return res.status(200).json({
        Spots:spots,
        Page: pageN,
        Size: sizeN
      });
    }
);

        // attributes: {
        //   include: [
        //     [
        //       Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), // Aggregating the stars from Review
        //       'avgRating'  // Alias for the result
        //     ],
        //     [
        //       Sequelize.col('SpotImages.url'),
        //       "previewImage"
        //     ]
        //   ]
        // },
        // group: ['Spot.id', 'SpotImages.id'],  // Grouping by Spot.id to get avgRating for each spot

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
              model: SpotImage,
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
        return res.status(200).json({
          Spots: spots
        });
    }
)

// Get details of a Spot from an id
router.get(
    '/:spotId',
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
                 fn('AVG', col('Reviews.stars')), // Aggregating the stars from Review
                 'avgRating'  // Alias for the result
               ],
               [
                 fn('COUNT', col('Reviews.id')), // Counting the # of Reviews 
                 'numReviews'  // Alias for the result
               ]
             ]
           },
           group: ['Spot.id', 'SpotImages.id', 'Owner.id'] 
       });

       // spotId not found
        if (spots.length===0) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spot Id found
        
        return res.status(200).json(spots);
    }
);

// Create a Spot
router.post(
    '/',
    // validateLogin,
    async(req, res) => {
        const ownerId = req.user.id;
        const {address, city, state, country, lat, lng, name, description, price} = req.body;
        try {
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
        }catch(e) {
          if (e.name === 'SequelizeValidationError') {
            return res.status(400).json({
                "message": "Bad Request", 
                "errors": {
                  "address": "Street address is required",
                  "city": "City is required",
                  "state": "State is required",
                  "country": "Country is required",
                  "lat": "Latitude must be within -90 and 90",
                  "lng": "Longitude must be within -180 and 180",
                  "name": "Name must be less than 50 characters",
                  "description": "Description is required",
                  "price": "Price per day must be a positive number"
                }
            })
          }
        }
    }
);

// Add an Image to a Spot based on the Spot's id
router.post(
    '/:spotId/images',
    async(req, res) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        // spotId not found
        const updatedSpot = await Spot.findOne({
            where: {ownerId: userId, id:spotId},
        });

        if (!updatedSpot) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spotId found
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
router.put(
    '/:spotId',
    async (req, res) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;

        // spotId not found
        const updatedSpot = await Spot.findOne({
          where: {id: spotId, ownerId:userId}
        });

        if (!updatedSpot) {
            res.status(404);
            return res.json({
                "message": "Spot couldn't be found"
            })
        }

        // spotId found
        try {
          const {address, city, state, country, lat, lng, name, description, price} = req.body;

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

          return res.status(200).json(updatedSpot)
      } catch(e) {
        if (e.name === 'SequelizeValidationError') {
          return res.status(400).json({
              "message": "Bad Request", 
              "errors": {
                "address": "Street address is required",
                "city": "City is required",
                "state": "State is required",
                "country": "Country is required",
                "lat": "Latitude must be within -90 and 90",
                "lng": "Longitude must be within -180 and 180",
                "name": "Name must be less than 50 characters",
                "description": "Description is required",
                "price": "Price per day must be a positive number"
              }
          })
        }
      }
    }
)

// Delete a Spot
router.delete(
    '/:spotId',
    async(req, res) => {
        const spotId = req.params.spotId;
        const userId = req.user.id;
        
        // spotId not found
        const updatedSpot = await Spot.findOne({
            where: {id:spotId, ownerId:userId}
        });


        if (!updatedSpot) {
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
);

/////////////////////////////////////////////////
// Reviews related

// Get all Reviews by a Spot's id
router.get(
  '/:spotId/reviews',
  async(req, res) => {
      const spotId = req.params.spotId;

      // spotId not found
      const ids = await Spot.findAll({
          where: {id:spotId}
      });

      if (ids.length===0) {
          res.status(404);
          return res.json({
              "message": "Spot couldn't be found"
          })
      }

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
  async(req, res) => {
      const spotId = Number(req.params.spotId);
      const userId = req.user.id;

      // spotId not found
      const ids = await Spot.findAll({
          where: {id:spotId}
      });

      if (ids.length===0) {
          res.status(404);
          return res.json({
              "message": "Spot couldn't be found"
          })
      }

      // review already exists for the spot from the current user
      const checkReview = await Review.findAll({
        where: {userId, spotId}
      });

      if (checkReview.length!==0) {
        return res.status(500).json({
          "message": "User already has a review for this spot"
        })
      };

      // spotId found
      try {
        const {review, stars} = req.body;
        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        })

        return res.status(201).json(newReview);
      }catch(e) {
        if (e.name === 'SequelizeValidationError') {
          return res.status(400).json({
              "message": "Bad Request", 
              "errors": {
                  "review": "Review text is required",
                  "stars": "Stars must be an integer from 1 to 5",
              }
          })
      }
      }

  }
);

/////////////////////////////////////////////////////////
// bookings related

// Get all bookings by a Spot's id
router.get(
  '/:spotId/bookings',
  async(req, res) => {
      const spotId = req.params.spotId;
      const current = req.user.id;

      // spotId not found
      const spot = await Spot.findOne({
          where: {id:spotId}
      });

      if (!spot) {
          res.status(404);
          return res.json({
              "message": "Spot couldn't be found"
          })
      }

      // find owner of the spot
      const ownerId = Number(spot.ownerId)
      
      // spot Id found & current user is not the owner
      if (ownerId !== Number(current)) {
        const bookingsUser = await Booking.findAll({
          where: {spotId:spotId, userId:current},
          attributes: ['spotId', 'startDate', 'endDate'],
        });
        return res.status(200).json({
          Bookings: bookingsUser
        });
      } else {
        
        // spot Id found & current user is the owner
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
        return res.status(200).json({
          Bookings: bookingsOwner
        });
      }
  }
);

// Create a Booking from a Spot based on the Spot's id
router.post(
  '/:spotId/bookings',
  async(req, res) => {
      const spotId = Number(req.params.spotId);
      const current = req.user.id;

      // spotId not found
      const spot = await Spot.findOne({
          where: {id:spotId}
      });

      if (!spot) {
          res.status(404);
          return res.json({
              "message": "Spot couldn't be found"
          })
      };

      // find owner of the spot
      let ownerId = Number(spot.ownerId)
      
      if (ownerId !== Number(current) ) {
        const {startDate, endDate} = req.body;

        // startDate in the past or endDate > startDate
        if (startDate < new Date() || startDate > endDate) {
          return res.status(400).json({
            "message": "Bad Request", 
            "errors": {
              "startDate": "startDate cannot be in the past",
              "endDate": "endDate cannot be on or before startDate"
            }
          })
        }

        // startDate/endDate conflicts with existing bookings
        const bookingDates = await Booking.findAll({
          where: {
              spotId: spotId,
              startDate: {
                  [Op.gte]: new Date()
              }
          },
          attributes: ['spotId', 'startDate', 'endDate']
        });

        bookingDates.forEch(el => {
            if ((startDate>=el.startDate && startDate < el.endDate) || 
            (startDate < el.startDate && endDate>el.startDate)) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }
                })
            }

        })
          
        // all requirements passed
        const newBooking = await Booking.create({
            spotId: spotId,
            userId: current,
            startDate,
            endDate,
        })

        return res.status(201).json(newBooking);

      }
      

  }
);

module.exports = router;

