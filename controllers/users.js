const User = require('../models/User');

// exports.getUsers = (req, res) => {
//   User.find().then((data) => {
//     res.status(200).json({
//       success: true,
//       data
//     });
//   });
// };

// @desc   Get all users
// @route  GET /api/v1/users
// @access Public
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    data: users
  });
};

// @desc   Get a single user
// @route  GET /api/v1/users/:id
// @access Public
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id); // Need to create an error handler
  res.status(200).json({
    success: true,
    data: user
  });
};

// @desc   Create user
// @route  POST /api/v1/users/:id
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
