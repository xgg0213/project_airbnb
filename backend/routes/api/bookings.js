// backend/routes/api/spots.js
const express = require('express');
const { Op, NOW } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');
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

// Get all of the Current User's Bookings
router.get(
    '/current',
    // validateLogin, // do I need this here?
    async(req, res) => {
        const current = req.user.id;

        const bookings = await Booking.findAll({
           where: {userId:current},
           include: [
            {
              model: Spot,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              }
            },
          ],
          group: ['Booking.id']  // Grouping by Spot.id to get avgRating for each spot
        });
        return res.status(200).json({
            Bookings: bookings
        });
    }
);

// Edit a booking
router.put(
    '/:bookingId',
    async (req, res) => {
        const bookingId = Number(req.params.bookingId);
        const userId = req.user.id;

        // bookingId not found
        const updatedBooking = await Booking.findOne({
            where: {userId:userId, id:bookingId}
        });

        
        if (!updatedBooking) {
            res.status(404);
            return res.json({
                "message": "Booking couldn't be found"
            })
        };

        // booking is in the past
        if (updatedBooking.endDate < new Date()) {
            return res.status(403).json({
                "message": "Past bookings can't be modified"
            })
        };


        // bookingId found 
        // try {
            const {startDate, endDate} = req.body;

            

            // start & end dates invalid
            if (startDate < new Date() || startDate > endDate) {
                return res.status(400).json({
                    "message": "Bad Request", 
                    "errors": {
                        "startDate": "startDate cannot be in the past",
                        "endDate": "endDate cannot be on or before startDate"
                    }
                })
            }      

            // NEED TO ADD ERROR 403: NEW START/END DATES CONFLICT WITH EXISTING

            await updatedBooking.update({
                startDate: startDate?startDate:updatedBooking.startDate,
                endDate: endDate?endDate:updatedBooking.endDate,
            });

            return res.status(200).json(updatedBooking)
        // }
        // catch(e) {
        //     if (e.name === 'SequelizeValidationError') {
        //         return res.status(400).json({
        //             "message": "Bad Request", 
        //             "errors": {
        //                 "startDate": "startDate cannot be in the past",
        //                 "endDate": "endDate cannot be on or before startDate"
        //             }
        //         })
        //     }
        // }
    
    }
);

// Delete a booking
router.delete(
    '/:bookingId',
    async (req, res) => {
        const bookingId = req.params.bookingId;
        const userId = req.user.id;

        // bookingId not found
        const updatedBooking = await Booking.findOne({
            where: {userId:userId, id: bookingId}
        });

        if (!updatedBooking) {
            res.status(404);
            return res.json({
                "message": "Booking couldn't be found"
            })
        };
        // bookingId found but it's a future booking
        if (updatedBooking.startDate < new Date()) {
            return res.status(403).json({
                "message": "Bookings that have been started can't be deleted"
            })
        }

        // bookingId found
        await Booking.destroy({
            where: {id:bookingId}
        });

        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }
)

module.exports = router;

