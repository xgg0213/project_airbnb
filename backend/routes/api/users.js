// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// validate signup
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      // user already exists
      const checkUser = await User.findAll({
        where: {
          [Op.or]: {
            username: username,
            email: email
          }
        }
      });

      if (checkUser.length!==0) {
        return res.status(500).json({
          "message": "User already exists",
          "errors": {
            "email": "User with that email already exists",
            "username": "User with that username already exists"
          }
        })
      };

      // body validation error
     
      try {
      const user = await User.create({ email, username, firstName, lastName, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({
        user: safeUser
      });
      } catch(e) {
        // if (e.name === 'SequelizeValidationError' || e.name==='SequelizeConstraintError') {
      //   if (e.title === 'Bad Request') {
      //     return res.status(400).json({
      //         "message": "Bad Request", 
      //         "errors": {
      //           "email": "Invalid email",
      //           "username": "Username is required",
      //           "firstName": "First Name is required",
      //           "lastName": "Last Name is required"
      //       }
      //     })
      // }
        return res.json(e)
      }
      
    }
);

module.exports = router;