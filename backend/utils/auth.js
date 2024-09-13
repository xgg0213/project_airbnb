const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Review, Booking, SpotImage, ReviewImage } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

// create restoreUser 
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
  
    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err.errors);
};

// if there is current user, but spotId does not belong
const validateAuthSpot = async (req, res, next) => {
    const spotId = req.params.spotId;
    const current = req.user.id
    const spot = await Spot.findByPk(+req.params.spotId);

    if (Number(current) === Number(spot.ownerId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

// if there is current user, but spotId does belong - cannot make a booking
const validateAuthNotSpot = async (req, res, next) => {
    const spotId = req.params.spotId;
    const current = req.user.id
    const spot = await Spot.findByPk(+req.params.spotId);

    if (Number(current) !== Number(spot.ownerId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

// if there is current user, but reviewId does not belong
const validateAuthReview = async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const current = req.user.id
    const review = await Review.findByPk(+req.params.reviewId);

    if (Number(current) === Number(review.userId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

// if there is current user, but bookingId does not belong
const validateAuthBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const current = req.user.id
    const booking = await Booking.findByPk(+req.params.bookingId);

    if (Number(current) === Number(booking.userId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

// if there is current user, but they neither has the booking or owns the spot
const validateAuthDBooking = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const current = req.user.id
    const booking = await Booking.findByPk(+req.params.bookingId);
    const spot = await Spot.findOne({where: {id:booking.spotId}})

    if (Number(current) === Number(booking.userId) || Number(current) === Number(spot.ownerId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

// if there is current user, but spotId does not belong - only has spot-image ID in params
const validateAuthSpotImage = async (req, res, next) => {
    const imageId = req.params.imageId;
    const current = req.user.id
    const spotImage = await SpotImage.findByPk(+req.params.imageId);
    const spot = await Spot.findByPk(spotImage.spotId);

    if (Number(current) !== Number(spot.ownerId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

// if there is current user, but reviewId does not belong - only has review-image ID in params
const validateAuthReviewImage = async (req, res, next) => {
    const imageId = req.params.imageId;
    const current = req.user.id
    const reviewImage = await ReviewImage.findByPk(+req.params.imageId);
    const review = await Review.findByPk(reviewImage.reviewId);

    if (Number(current) !== Number(review.userId)) return next();

    const err = new Error('Forbidden');
    err.title = 'Forbidden';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err.errors);
};

module.exports = { setTokenCookie, restoreUser, requireAuth, validateAuthSpot, validateAuthNotSpot
    ,validateAuthReview, validateAuthBooking, validateAuthDBooking, validateAuthSpotImage, validateAuthReviewImage
};