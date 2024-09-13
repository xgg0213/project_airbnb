// backend/utils/validation.js
const express = require('express');
const { validationResult } = require('express-validator');
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require('../../db/models');

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

// // bookingId not found
// const validateBookingId = async(req, res, next) => {
//   const bookingId = req.params.bookingId;

//   // bookingId not found
//   const updatedBooking = await Booking.findOne({
//       where: {id:+req.params.bookingId},
//   });

//   if (Number(bookingId) && updatedBooking) return next();

//   const err = new Error("Booking couldn't be found");
//     err.title = "Booking couldn't be found";
//     err.errors = { message: "Booking couldn't be found" };
//     err.status = 404;
//     return next(err.errors);
// };

// // spotId not found
// const validateSpotId = async(req, res, next) => {
//   const spotId = req.params.spotId;

//   // spotId not found
//   const updatedSpot = await Spot.findOne({
//       where: {id:+req.params.spotId},
//   });

//   if (Number(spotId) && updatedSpot) return next();

//   const err = new Error("Spot couldn't be found");
//     err.title = "Spot couldn't be found";
//     err.errors = { message: "Spot couldn't be found" };
//     err.status = 404;
//     return next(err.errors);
// };

// // reviewId not found
// const validateReviewId = async(req, res, next) => {
//   const reviewId = req.params.reviewId;

//   // reviewId not found
//   const updatedReview = await Review.findOne({
//       where: {id:+req.params.reviewId},
//   });

//   if (Number(reviewId) && updatedReview) return next();

//   const err = new Error("Review couldn't be found");
//     err.title = "Review couldn't be found";
//     err.errors = { message: "Review couldn't be found" };
//     err.status = 404;
//     return next(err.errors);
// };

// // spotImageId not found
// const validateSpotImageId = async(req, res, next) => {
//   const imageId = req.params.imageId;

//   // reviewId not found
//   const updatedSpotImage = await SpotImage.findOne({
//       where: {id:+req.params.imageId},
//   });

//   if (Number(imageId) && updatedSpotImage) return next();

//   const err = new Error("Spot Image couldn't be found");
//     err.title = "Spot Image couldn't be found";
//     err.errors = { message: "Spot Image couldn't be found" };
//     err.status = 404;
//     return next(err.errors);
// };

// // spotImageId not found
// const validateReviewImageId = async(req, res, next) => {
//   const imageId = req.params.imageId;

//   // reviewId not found
//   const updatedReviewImage = await ReviewImage.findOne({
//       where: {id:+req.params.imageId},
//   });

//   if (Number(imageId) && updatedReviewImage) return next();

//   const err = new Error("Review Image couldn't be found");
//     err.title = "Review Image couldn't be found";
//     err.errors = { message: "Review Image couldn't be found" };
//     err.status = 404;
//     return next(err.errors);
// };

// module.exports = {
//   handleValidationErrors,
//   validateBookingId,
//   validateSpotId,
//   validateReviewId,
//   validateSpotImageId,
//   validateReviewImageId
// };

module.exports = {
  handleValidationErrors,
}