const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { Sequelize, fn, col } = require('sequelize');
// const sequelize = require('../../config/database.js');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');
// const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Delete a spot image
router.delete(
    '/:imageId',
    async(req, res) => {
        const imageId = req.params.imageId;
        const userId = req.user.id;

        // imageId not found
        const updatedImage = await SpotImage.findOne({
            where: {id: imageId}
        });
        const updatedSpots = await Spot.findAll({
            where: {ownerId: userId}
        });

        let check = false;
        updatedSpots.forEach(el => {
            if(el.id === updatedImage.spotId) check = true;
        })

        if (!updatedImage || check === false) {
            res.status(404);
            return res.json({
                "message": "Spot Image couldn't be found"
            })
        };

        // imageId found
        await SpotImage.destroy({
            where: {id:imageId}
        }); 

        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }
);

module.exports = router;

