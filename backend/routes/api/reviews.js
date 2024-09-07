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

// Get all Reviews of the Current User
router.get(
    '/current',
    // validateLogin, // do I need this here?
    async(req, res) => {
        const current = req.user.id;

        const reviews = await Review.findAll({
           where: {userId:current},
           include: [
            {
              model: Spot,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              }
            },
            {
              model: Image,
              as: 'ReviewImages',  // The alias defined in the association
              attributes: ['id', 'url']
            }
          ],
          group: ['Review.id']  // Grouping by Spot.id to get avgRating for each spot
        });
        return res.status(200).json({
            Reviews: reviews
        });
    }
);

        

// Add an Image to a Review based on the Review's id
router.post(
    '/:reviewId/images',
    async(req, res) => {
        const reviewId = Number(req.params.reviewId);
        const userId = req.user.id;

        // reviewId not found
        const ids = await Review.findAll({
            where: {userId},
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(reviewId))) {
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        }

        // reviewId exists but already 10 images
        const images = await Image.findAll({
            where :{imageableId: reviewId, imageableType: 'Review'},
            attributes: ['id']
        })

        const imageArray = []
        images.forEach(el => {
            imageArray.push(el.id)
        });

        if (imageArray.length>=10) {
            return res.status(403).json({
                "message": "Maximum number of images for this resource was reached"
            })
        }

        // reviewId found
        const {url} = req.body;
        const newImage = await Image.create({
            imageableId: reviewId,
            imageableType: 'Review',
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
    async (req, res) => {
        const reviewId = Number(req.params.reviewId);
        const userId = req.user.id;

        // reviewId not found
        const ids = await Review.findAll({
            where: {userId},
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(reviewId))) {
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        }

        // reviewId found
        try {
            const {review, stars} = req.body;
            const updatedReview = await Review.findOne({
            where: {id: reviewId}
            });

            await updatedReview.update({
                review: review?review:updatedReview.review,
                stars: stars?stars:updatedReview.stars,
            });

            return res.status(200).json(updatedReview)
        } catch(e) {
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
)

// Delete a Review
router.delete(
    '/:reviewId',
    async(req, res) => {
        const reviewId = Number(req.params.reviewId);
        
        // reviewId not found
        const ids = await Review.findAll({
            attributes: ['id']
        });
        const array = [];

        ids.forEach(el => {
            array.push(Number(el.id))
        })

        if (!array.includes(Number(reviewId))) {
            res.status(404);
            return res.json({
                "message": "Review couldn't be found"
            })
        }

        // spotId found
        await Review.destroy({
            where: {id:reviewId}
        });

        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }
)

module.exports = router;

