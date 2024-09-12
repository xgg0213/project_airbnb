// backend/routes/api/bookings.js
const express = require('express');
const { Op, NOW } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser,requireAuth } = require('../../utils/auth');
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
    requireAuth,
    async(req, res) => {

        // with logged in user
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
          group: ['Booking.id', 'Spot.id']  // Grouping by Spot.id to get avgRating for each spot
        });
        return res.status(200).json({
            Bookings: bookings
        });
    }
);

// Edit a booking
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const bookingId = req.params.bookingId;

        // bookingId is not an integer
        if (!Number(bookingId)) {
            return res.status(404).json({
                "message": "Booking couldn't be found"
            })
        }

        // bookingId not found
        const updatedBooking = await Booking.findOne({
            where: {id:bookingId},
        });

        if (!updatedBooking) {
            res.status(404);
            return res.json({
                "message": "Booking couldn't be found"
            })
        }

        // not matching bookingId
        const userId = req.user.id; 
        if (Number(updatedBooking.userId) !== Number(userId)) {
            return res.status(403).json({
            "message": "Forbidden"
            }) 
        };

        // bookingId found 
        const {startDate, endDate} = req.body;

        // start & end dates invalid
        if (new Date(startDate) < new Date() || new Date(startDate) > new Date(endDate)) {
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
                spotId: updatedBooking.spotId,
                // startDate: {
                //     [Op.gte]: new Date()
                // }
            },
            attributes: ['spotId', 'startDate', 'endDate']
        });


        bookingDates.forEach(el => {
            if ((new Date(startDate) >= new Date(el.startDate) && new Date(startDate) < new Date(el.endDate)) || 
            (new Date(startDate) < new Date(el.startDate) && new Date(endDate) > new Date(el.startDate))) {
                return res.status(403).json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }
                })
            }

        })

        await updatedBooking.update({
            startDate: startDate?startDate:updatedBooking.startDate,
            endDate: endDate?endDate:updatedBooking.endDate,
        });

        return res.status(200).json(updatedBooking)
    
    }
);

// Delete a booking
router.delete(
    '/:bookingId',
    requireAuth,
    async (req, res) => {
        const bookingId = req.params.bookingId;

        // bookingId is not an integer
        if (!Number(bookingId)) {
            return res.status(404).json({
                "message": "Booking couldn't be found"
            })
        }
        

        // bookingId not found
        const updatedBooking = await Booking.findByPk(bookingId);

        if (!updatedBooking) {
            res.status(404);
            return res.json({
                "message": "Booking couldn't be found"
            })
        }

        // does not belong to the logged in user && logged in user does not own the spot
        const userId = req.user.id; 
        const spotId = updatedBooking.spotId;
        const spot = await Spot.findOne({where: {id:spotId}});

        if (Number(updatedBooking.userId) !== Number(userId) && Number(spot.ownerId) !== Number(userId) ) {
            return res.status(403).json({
            "message": "Forbidden"
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

