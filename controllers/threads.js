const { findByIdAndUpdate } = require('../models/Thread');
const Thread = require('../models/Thread');
const User = require('../models/User');

// Or should it be /api/v1/users/:userId/threads ? DONE. Did this by merging parameters.

// @desc   Get threads created by a specific user
// @route  GET /api/v1/threads
// @route  GET /api/v1/users/:userId/threads
// @access Public
exports.getThreads = async (req, res) => {
  if (req.params.userId) {
    // TEST

    const user = await User.findById(req.params.userId).select(
      'firstName lastName'
    );

    /*******TEST ABOVE **********/
    const threads = await Thread.find({
      author: req.params.userId
    });

    res.status(200).json({
      success: true,
      user,
      data: threads
    });
  } else {
    const threads = await Thread.find();
    res.status(200).json({
      success: true,
      data: threads
    });
  }
};

// @desc   Get a specific thread
// @route  GET /api/v1/threads/:id
// @access Public
exports.getThread = async (req, res) => {
  //req.body.author = req.params.id; // This is of type ObjectId

  const thread = await Thread.findById(req.params.id);

  console.log(req.params);

  res.status(200).json({
    success: true,
    data: thread
  });
};

// @desc   Create thread
// @route  POST /api/v1/threads
// @access Private
exports.createThread = async (req, res) => {
  req.body.author = req.params.id; // This is of type ObjectId

  const user = await User.findById(req.params.id); // I believe I should do this in the model itself, not here

  const thread = await Thread.create(req.body); // Need to create an error handler

  user.askedQuestions.push(thread._id);

  res.status(200).json({
    success: true,
    data: thread
  });
};

// @desc   Create thread
// @route  POST /api/v1/threads/:id
// @access Private
exports.updateThread = async (req, res) => {
  const thread = findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: thread
  });
};
