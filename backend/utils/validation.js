// backend/utils/validation.js
const express = require('express');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require('../db/models');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const handleValidationIds = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("couldn't be found");
    err.errors = errors;
    err.status = 404;
    err.title = "couldn't be found";
    next(err);
  }
  next();
};


// id not a number
const validateIdNaN = (req, res, next) => {
  const id = req.params.bookingId || req.params.spotId || req.params.reviewId || req.params.imageId
  const numericId = Number(id);

  if (!isNaN(numericId)) return next();

  const err = new Error("couldn't be found");
  err.title = "couldn't be found";
  err.status = 404;
  if (req.params.bookingId) err.message = "Booking couldn't be found";
  if (req.params.reviewId) err.message = "Review couldn't be found";
  if (req.params.spotId) err.message = "Spot couldn't be found";
  if (req.originalUrl.includes('spot-images')) err.message = "Spot Image couldn't be found";
  if (req.originalUrl.includes('review-images')) err.message = "Review Image couldn't be found"
  
  return next(err);
};

// bookingId not found
const validateBookingId = async(req, res, next) => {
  const bookingId = req.params.bookingId;
  const updatedBooking = await Booking.findOne({
      where: {id:+req.params.bookingId},
  });

  if (updatedBooking) return next();

  const err = new Error("Booking couldn't be found");
    err.title = "couldn't be found";
    err.errors = { message: "Booking couldn't be found" };
    err.status = 404;
    return next(err);
};

// spotId not found
const validateSpotId = async(req, res, next) => {
  const spotId = req.params.spotId;
  const updatedSpot = await Spot.findOne({
      where: {id:+req.params.spotId},
  });

  if (updatedSpot) return next();

  const err = new Error("Spot couldn't be found");
    err.title = "couldn't be found";
    err.errors = { message: "Spot couldn't be found" };
    err.status = 404;
    return next(err);
};

// reviewId not found
const validateReviewId = async(req, res, next) => {
  const reviewId = req.params.reviewId;
  const updatedReview = await Review.findOne({where: {id:reviewId}});
  if (updatedReview) return next();

  const err = new Error("Review couldn't be found");
    err.title = "couldn't be found";
    err.errors = { message: "Review couldn't be found" };
    err.status = 404;
    return next(err);
};

// spotImageId not found
const validateSpotImageId = async(req, res, next) => {
  const imageId = req.params.imageId;
  const updatedSpotImage = await SpotImage.findOne({
      where: {id:+req.params.imageId},
  });

  if (updatedSpotImage) return next();

  const err = new Error("Spot Image couldn't be found");
    err.title = "couldn't be found";
    err.errors = { message: "Spot Image couldn't be found" };
    err.status = 404;
    return next(err);
};

// reviewImageId not found
const validateReviewImageId = async(req, res, next) => {
  const imageId = req.params.imageId;

  const updatedReviewImage = await ReviewImage.findOne({
      where: {id:+req.params.imageId},
  });

  if (updatedReviewImage) return next();

  const err = new Error("Review Image couldn't be found");
  err.title = "couldn't be found";
  err.errors = { message: "Review Image couldn't be found" };
  err.status = 404;
  return next(err);
};

////////////////////////////////////////////////////////////
// validate review exists
const validateReviewExists = async(req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const review = await Review.findOne({where: {spotId, userId}});
  if (!review ) return next();

  const err = new Error("User already has a review for this spot");
  err.title = "review exists";
  err.errors = { message: "User already has a review for this spot" };
  err.status = 500;
  return next(err);

};

// validate user exists
const validateUserExists = async(req, res, next) => {
  const {username, email} = req.body;
  const checkUser = await User.findOne({
    where: {
      [Op.or]: {
        username: username,
        email: email
      }
    }
  });
  if (!checkUser) return next();

  const err = new Error("User already exists");
  err.title = "user exists";
  err.message = 'User already exists'
  err.errors = { "email": "User with that email already exists",
                 "username": "User with that username already exists" };
  err.status = 500;
  return next(err);
};


// validate image number <=10
const validateReviewImageN = async(req, res, next) => {
  const reviewId = req.params.reviewId;
  const reviewImages = await ReviewImage.findAll({
      where :{reviewId},
      attributes: ['id']
  });

  if (!reviewImages || reviewImages.length < 10) return next();
  const err = new Error("Maximum review images number reached");
  err.title = "Maximum review images number reached";
  err.errors = { "message": "Maximum number of images for this resource was reached" };
  err.status = 403;
  return next(err);

};

/////////////////////////////////////////////////////////////////////////////
// validate booking start date
const validateBookingStartDate = async(req, res, next) => {
  const bookingId = req.params.bookingId;
  const booking = await Booking.findOne({
    where: {id:+req.params.bookingId},
  });
  const today = new Date().setHours(0, 0, 0, 0);
  const startDate = new Date(booking.startDate).setHours(0, 0, 0, 0);

  if (startDate > today) return next();
  
  const err = new Error("Bookings that have been started can't be deleted");
  err.title = "Booking started";
  err.errors = { "message": "Bookings that have been started can't be deleted" };
  err.status = 403;
  return next(err);
  
};

// validate booking end date
const validateBookingEndDate = async(req, res, next) => {
  const bookingId = req.params.bookingId;

  const booking = await Booking.findOne({
    where: {id:+req.params.bookingId},
  });
  const today = new Date().setHours(0, 0, 0, 0);
  const endDate = new Date(booking.endDate).setHours(0, 0, 0, 0);

  if (endDate >= today) return next();
  
  const err = new Error("Past bookings can't be modified");
  err.title = "Past bookings can't be modified";
  err.errors = { "message": "Past bookings can't be modified" };
  err.status = 403;
  return next(err);
  
};

// create a new booking: validate if startDate & endDate conflicts with existing booking
const validateBookingConflicts = async(req, res, next) => {
  const {startDate, endDate} = req.body;
  const spotId = req.params.spotId;
  const existingBookings = await Booking.findAll({
    where: { spotId },
    attributes: ['startDate', 'endDate'],
  })
  
  const hasConflict = existingBookings.some((booking) => {
    const existingStart = new Date(booking.startDate);
    const existingEnd = new Date(booking.endDate);
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
  
    return (
      (newStart >= existingStart && newStart < existingEnd) || // new start date overlaps an existing booking
      (newEnd > existingStart && newEnd <= existingEnd) || // new end date overlaps an existing booking
      (newStart <= existingStart && newEnd >= existingEnd) // new booking fully contains an existing booking
    );
  });
  
  if (!hasConflict) return next();

  const err = new Error("Booking conflicts with existing");
  err.title = "Booking conflicts with existing";
  err.message = 'Sorry, this spot is already booked for the specified dates';
  err.errors = { startDate: 'Start date conflicts with an existing booking',
                 endDate: 'End date conflicts with an existing booking', };
  err.status = 403;
  return next(err);
};

// create a new booking: validate if startDate & endDate conflicts with existing booking
const validateBookingConflictsUpdate = async(req, res, next) => {
  const {startDate, endDate} = req.body;
  const bookingId = Number(req.params.bookingId);
  const booking = await Booking.findByPk(bookingId);
  const existingBookings = await Booking.findAll({
    where: {
      spotId:booking.spotId,
      id: {
        [Op.ne]: bookingId
      }
    },
    attributes: ['startDate', 'endDate']
  })
  
  const hasConflict = existingBookings.some((booking) => {
    const existingStart = new Date(booking.startDate);
    const existingEnd = new Date(booking.endDate);
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
  
    return (
      (newStart >= existingStart && newStart < existingEnd) || // new start date overlaps an existing booking
      (newEnd > existingStart && newEnd <= existingEnd) || // new end date overlaps an existing booking
      (newStart <= existingStart && newEnd >= existingEnd) // new booking fully contains an existing booking
    );
  });
  
  if (!hasConflict) return next();

  const err = new Error("Booking conflicts with existing");
  err.title = "Booking conflicts with existing";
  err.message = 'Sorry, this spot is already booked for the specified dates';
  err.errors = { startDate: 'Start date conflicts with an existing booking',
                 endDate: 'End date conflicts with an existing booking', };
  err.status = 403;
  return next(err);
}


module.exports = {
  handleValidationErrors,
  validateBookingId,
  validateSpotId,
  validateReviewId,
  validateSpotImageId,
  validateReviewImageId,
  validateReviewExists,
  validateUserExists,
  validateReviewImageN,
  validateBookingStartDate,
  validateBookingConflicts,
  validateIdNaN,
  validateBookingEndDate,
  validateBookingConflictsUpdate
};