// backend/routes/api/reviews.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col, literal } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser, requireAuth, validateAuthReview } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors,validateBookingId,validateSpotId,validateReviewId,validateSpotImageId,validateReviewImageId, validateReviewImageN } = require('../../utils/validation');

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

// get all reviews of the current user
router.get(
    '/current',
    requireAuth,
    async(req, res) => {
        // with logged in user
        const current = req.user.id;
        
        const reviews = await Review.findAll({
           where: {userId:current},
           include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: Spot,
            //  adding below works for POSTMAN(SQLite but not postgresql)
            //   include: [
            //     {
            //       model: SpotImage,
            //       as: 'SpotImages',
            //       attributes: ['url'],
            //       where: {preview:true},
            //       required:false
            //     },            
            //   ],
              
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: ReviewImage,
              as: 'ReviewImages',  // The alias defined in the association
              attributes: ['id', 'url']
            }
          ],
          group: ['Review.id', 'User.id', 'Spot.id', 'ReviewImages.id'],
        });

        // get previewImages
        const formattedReviews = await Promise.all(
            reviews.map(async (review) => {
                const reviewData = review.toJSON();
                const spotImage = await SpotImage.findOne({ where: { spotId: reviewData.spotId, preview:true}});
                // return spotImage;  // This will now return the resolved spotImage
                reviewData.Spot.previewImage = spotImage ? spotImage.url : null;  // Add previewImage
                return reviewData;
            })
        );

        return res.status(200).json({
            Reviews: formattedReviews
        });
    }
);

        

// Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    requireAuth,
    validateReviewId,
    validateAuthReview,
    validateReviewImageN,
    async(req, res) => {
        const reviewId = req.params.reviewId;

        // reviewId found && meeting all requirements
        const {url} = req.body;
        const newImage = await ReviewImage.create({
            reviewId: reviewId,
            url
        })

        return res.status(201).json({
            "id": newImage.id,
            "url": url,
        })

    }
);

// Edit a review
router.put(
    '/:reviewId',
    requireAuth,
    validateAuthReview,
    validateReview,
    validateReviewId,
    async (req, res) => {
        const reviewId = req.params.reviewId;

        const updatedReview = await Review.findOne({
            where: {id:reviewId},
        });

        // reviewId found && meeting all requirements

        const {review, stars} = req.body;

        await updatedReview.update({
            review: review?review:updatedReview.review,
            stars: stars?stars:updatedReview.stars,
        });

        return res.status(200).json(updatedReview)

    }
)

// Delete a Review
router.delete(
    '/:reviewId',
    requireAuth,
    validateReviewId,
    validateAuthReview,
    async(req, res) => {
        const reviewId = req.params.reviewId;

        // reviewId found && meeting all requirements
        await Review.destroy({
            where: {id:reviewId}
        }); 

        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }
);

module.exports = router;

