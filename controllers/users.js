const User = require('../models/User');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc   Get all users
// @route  GET /api/v1/users
// @access Public
exports.getUsers = asyncHandler(async (req, res) => {
  console.log(req.params);
  const users = await User.find();

  res.status(200).json({
    success: true,
    data: users
  });
});

// @desc   Get a single user
// @route  GET /api/v1/users/:username
// @access Public
exports.getUser = asyncHandler(async (req, res) => {
  console.log(req.params.username);
  const user = await User.find({
    username: req.params.username
  });
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc   Get a single user
// @route  GET /api/v1/users/me // or myprofile
// @access Public
exports.getLoggedInUser = asyncHandler(async (req, res) => {
  console.log('THIS IS ME');
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// @desc   Create user
// @route  POST /api/v1/users
// @access Public
exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body); // Need to create an error handler
  console.log(req.body);
  console.log('LOL');
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc   Update user
// @route  PUT /api/v1/users/:id // which is actually username... damn. Gotta homogenize this.
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  // I can change the password from here. That shouldn't be the case! gotta fix that

  // Since this command uses findByIdAndUpdate, the middleware functions that are triggered on 'save'
  // won't run at all! what's below won't go through the middleware for hashing passwords.

  const { password, ...fieldsToUpdate } = req.body;

  if (!Object.keys(fieldsToUpdate).length) {
    res.status(401).json({
      success: false,
      data: 'No fields to update'
    });
    return next('No fields to update.');
  }

  const user = await User.findByIdAndUpdate(
    req.params.username,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.username); // shouldn't be username but id... I gotta homogenize this!

  res.status(200).json({
    success: true,
    data: {}
  });
});
