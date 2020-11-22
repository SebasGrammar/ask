const User = require('../models/User');

// @desc   Get all users
// @route  GET /api/v1/users
// @access Public
exports.getUsers = async (req, res) => {
  console.log(req.params);
  const users = await User.find();

  res.status(200).json({
    success: true,
    data: users
  });
};

// @desc   Get a single user
// @route  GET /api/v1/users/:username
// @access Public
exports.getUser = async (req, res) => {
  console.log(req.params.username);
  const user = await User.find({
    username: req.params.username
  });
  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc   Get a single user
// @route  GET /api/v1/users/me // or myprofile
// @access Public
exports.getLoggedInUser = async (req, res) => {
  console.log('THIS IS ME');
  res.status(200).json({
    success: true,
    data: req.user
  });
};

// @desc   Create user
// @route  POST /api/v1/users
// @access Public
exports.createUser = async (req, res) => {
  const user = await User.create(req.body); // Need to create an error handler
  console.log(req.body);
  console.log('LOL');
  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc   Update user
// @route  PUT /api/v1/users/:id // which is actually username... damn. Gotta homogenize this.
// @access Private
exports.updateUser = async (req, res) => {
  // I can change the password from here. That shouldn't be the case! gotta fix that
  // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true
  // });

  const user = await User.findByIdAndUpdate(req.params.username, req.body, {
    new: true,
    runValidators: true
  });

  console.log(user);

  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = async (req, res) => {
  // I can change the password from here. That shouldn't be the case! gotta fix that
  // const user = await User.findByIdAndDelete(req.params.id);
  const user = await User.findByIdAndDelete(req.params.username); // shouldn't be username but id... I gotta homogenize this!

  res.status(200).json({
    success: true,
    data: {}
  });
};
