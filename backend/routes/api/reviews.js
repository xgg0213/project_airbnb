// backend/routes/api/reviews.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col, literal } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');
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

// Get all Reviews of the Current User
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
              include: [
                {
                  model: SpotImage,
                  as: 'SpotImages',
                  attributes: ['url'],
                  where: {preview:true},
                  required:false
                }
              ],
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
                include: [
                  [
                    literal(`(
                    SELECT url 
                    FROM "SpotImages" AS "SpotImages"
                    WHERE "SpotImages"."spotId" = "Spot"."id"
                    AND "SpotImages"."preview" = true
                    LIMIT 1
                    )`),
                    'previewImage'  // Alias to be used for the resulting image URL
                  ]  // Include previewImage as an attribute
                ]
              },
            //   attributes: {
            //     include: [
            //         [Sequelize.col('SpotImages.url'), 'previewImage']
            //     ]
            //   }
            },
            {
              model: ReviewImage,
              as: 'ReviewImages',  // The alias defined in the association
              attributes: ['id', 'url']
            }
          ],
          group: ['Review.id', 'User.id', 'Spot.id','ReviewImages.id']  
        });

        const formattedReviews = reviews.map(review => {
            const reviewData = review.toJSON();
            reviewData.Spot.previewImage1 = reviewData.Spot.SpotImages ? reviewData.Spot.SpotImages[0].url : null;  // Add previewImage
            delete reviewData.Spot.SpotImages;  // Remove SpotImages array
            return reviewData;
          });
        return res.status(200).json({
            Reviews: formattedReviews//reviews
        });
    }
);

        

// Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    requireAuth,
    async(req, res) => {
        const reviewId = req.params.reviewId;

        // reviewId not found
        const updatedReview = await Review.findOne({
            where: {id:reviewId},
        });

        if (!updatedReview) {
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        }

        // no matching reviewId
        const userId = req.user.id; 
        if (Number(updatedReview.userId) !== Number(userId)) {
            return res.status(403).json({
            "message": "Forbidden"
            }) 
        };

        // reviewId exists && matching but already 10 images
        const images = await ReviewImage.findAll({
            where :{reviewId: reviewId},
            attributes: ['id']
        })

        if (images.length>=10) {
            return res.status(403).json({
                "message": "Maximum number of images for this resource was reached"
            })
        }

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
    validateReview,
    async (req, res) => {
        const reviewId = req.params.reviewId;

        // reviewId not found
        const updatedReview = await Review.findOne({
            where: {id:reviewId},
        });

        if (!updatedReview) {
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        }

        // no matching reviewId
        const userId = req.user.id; 
        if (Number(updatedReview.userId) !== Number(userId)) {
            return res.status(403).json({
            "message": "Forbidden"
            }) 
        };

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
    async(req, res) => {
        const reviewId = req.params.reviewId;

        // reviewId not found
        const updatedReview = await Review.findOne({
            where: {id:reviewId},
        });

        if (!updatedReview) {
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        }

        // no matching reviewId
        const userId = req.user.id; 
        if (Number(updatedReview.userId) !== Number(userId)) {
            return res.status(403).json({
            "message": "Forbidden"
            }) 
        };

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

