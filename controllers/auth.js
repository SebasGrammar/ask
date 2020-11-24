const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

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

  // Validate email and password

  if (!email || !password) {
    let message =
      !email && !password
        ? 'an email and a password'
        : !email
        ? 'an email'
        : 'a password';

    // return next(
    //   new ErrorResponse('Please provide an email and a password.', 400)
    // );

    return next(new ErrorResponse(`Please provide ${message}.`, 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials.', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials.', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc   Log user out / clear cookie
// @route  GET api/v1/auth/logout
// @access Private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    data: {}
  });
});

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
    success: true,
    token
  });
};
