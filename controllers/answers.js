const Answer = require('../models/Answer');
const Thread = require('../models/Thread');
const User = require('../models/User');

// @desc   Get threads created by a specific user
// @route  GET /api/v1/answers // I'm not sure if getting all the answers posted would be convenient...
// @route  GET /api/v1/threads/:threadId/answers -> use a rerouter here
// @route  // hmmm... what a mess. I must creaGET /api/v1/users/:userId/answers te one for threads, then! -> /:userId/threads
// @route  GET /api/v1/threads/:threadId/:userId
// @access Public
exports.getAnswers = async (req, res, next) => {
  if (req.params.username && req.params.threadId) {
    console.log('Get answers submitted in a thread by user with id.');
    const answers = await Answer.find({
      author: req.params.username,
      thread: req.params.threadId
    });
    res.status(200).json({
      success: true,
      data: answers
    });
  } else if (req.params.threadId) {
    console.log('The request comes from threads');
    const answers = await Answer.find({ thread: req.params.threadId });
    res.status(200).json({
      success: true,
      data: answers
    });
  } else if (req.params.username) {
    console.log('The request comes from users');
    const answers = await Answer.find({ author: req.params.username });
    res.status(200).json({
      success: true,
      data: answers
    });
  } else {
    console.log('Just get the fucking answers');
    const answers = await Answer.find();
    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    });
  }
  next();
};

// @desc   Submit answer to thread
// @route  POST /api/v1/threads/:threadId/answers
// @access Public

exports.submitAnswer = async (req, res, next) => {
  console.log('FUCK THIS SHIT!');
  console.log(req.user);

  // user = logged in user (middleware)
  const username = 'sebas_pm';
  req.body.author = username;
  req.body.thread = req.params.threadId;

  const thread = await Thread.findById(req.params.threadId);

  const answer = await Answer.create(req.body);

  res.status(200).json({
    success: true,
    data: answer
  });
};
