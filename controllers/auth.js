const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');

// @desc   Register user
// @route  POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    address,
    gender
  } = req.body;
  // role should go in there, too.

  console.log('BAAAAAA');
  console.log(address);

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    address,
    gender
    // role
  });

  sendTokenResponse(user, 200, res);
});

// @desc   Login user
// @route  GET /api/v1/register
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log('FUCK');

  // Validate email and password

  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide an email and a password.', 400)
    );
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials.', 401));
  }

  console.log(user);

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  console.log(isMatch);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials.', 401));
  }

  //   // Create token
  //   const token = user.getSignedJwtToken();

  //   res.status(200).json({
  //     success: true,
  //     token: token
  //   });

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), // 30 days
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    // token is the name of the cookie we are sending! of course it can be whatever you want.
    success: true,
    token
  });
};
