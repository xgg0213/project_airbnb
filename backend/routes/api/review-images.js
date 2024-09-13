// const express = require('express');
// const { Op } = require('sequelize');
// const bcrypt = require('bcryptjs');

// const { Sequelize, fn, col } = require('sequelize');
// // const sequelize = require('../../config/database.js');

// const { setTokenCookie, restoreUser,requireAuth, validateAuthReviewImage } = require('../../utils/auth');
// const { User, Review, ReviewImage, SpotImage } = require('../../db/models');

// const { check } = require('express-validator');
// const { handleValidationErrors, validateReviewImageId } = require('../../utils/validation');

// const router = express.Router();

// // Delete a Review image
// router.delete(
//     '/:imageId',
//     requireAuth,
//     validateAuthReviewImage,
//     validateReviewImageId,
//     async(req, res) => {
//         const imageId = req.params.imageId;

//         // imageId found
//         await ReviewImage.destroy({
//             where: {id:imageId}
//         }); 

//         return res.status(200).json({
//             "message": "Successfully deleted"
//         })
//     }
// );

// module.exports = router;

