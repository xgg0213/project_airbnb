const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser,requireAuth, validateAuthSpotImage } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateSpotImageId, validateIdNaN } = require('../../utils/validation');

const router = express.Router();

// Delete a spot image
router.delete(
    '/:imageId',
    requireAuth,
    validateIdNaN,
    validateSpotImageId,
    validateAuthSpotImage,
    async(req, res) => {
        const imageId = req.params.imageId;

        // imageId found && matching
        await SpotImage.destroy({
            where: {id:imageId}
        }); 

        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }
);

module.exports = router;

