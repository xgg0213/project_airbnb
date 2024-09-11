const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser,requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage, SpotImage } = require('../../db/models');
// const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Delete a Review image
router.delete(
    '/:imageId',
    requireAuth,
    async(req, res) => {
        const imageId = req.params.imageId;

        const updatedImage = await ReviewImage.findOne({
            where: {id:imageId},
        });

        // image not found
        if (!updatedImage) {
            res.status(404);
            return res.json({
                "message": "Review Image couldn't be found"
            })
        }

        // image found but review does not belong to the logged in user
        const reviewId = updatedImage.reviewId;
        const updatedReview = await Review.findOne({where: {id:reviewId}})
        const userId = req.user.id; 

        if (Number(updatedReview.userId) !== Number(userId)) {
            return res.status(403).json({
            "message": "Forbidden"
            }) 
        };

        // imageId found
        await ReviewImage.destroy({
            where: {id:imageId}
        }); 

        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }
);

module.exports = router;

