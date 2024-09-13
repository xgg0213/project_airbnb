// backend/routes/api/bookings.js
const express = require('express');
const { Op, NOW } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser,requireAuth, validateAuthBooking, validateAuthDBooking } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage, Booking } = require('../../db/models');
const { handleValidationErrors,validateBookingId, validateSpotId, validateReviewId,validateSpotImageId,validateReviewImageId, validateBookingStartDate, validateBookingConflicts } = require('../../utils/validation');

const { check } = require('express-validator');

const router = express.Router();

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

        // get previewImages
        const formattedBookings = await Promise.all(
            bookings.map(async (booking) => {
                const bookingData = booking.toJSON();
                const spotImage = await SpotImage.findOne({ where: { spotId: bookingData.spotId, preview:true}});
                // return spotImage;  // This will now return the resolved spotImage
                bookingData.Spot.previewImage = spotImage ? spotImage.url : null;  // Add previewImage
                return bookingData;
            })
        );

        return res.status(200).json({
            Bookings: formattedBookings
        });
    }
);

// Edit a booking
router.put(
    '/:bookingId',
    requireAuth,
    validateBookingId,
    validateAuthBooking,
    validateDates,
    validateBookingConflicts,
    async (req, res) => {
        const bookingId = req.params.bookingId;

        // bookingId found 
        const {startDate, endDate} = req.body;


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
    validateBookingId,
    validateAuthDBooking,
    validateBookingStartDate,
    async (req, res) => {
        const bookingId = req.params.bookingId;

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

