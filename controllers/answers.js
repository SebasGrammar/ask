const Answer = require('../models/Answer');

// @desc   Get threads created by a specific user
// @route  GET /api/v1/answers // I'm not sure if getting all the answers posted would be convenient...
// @route  GET /api/v1/threads/:threadId/answers -> use a rerouter here
// @route  GET /api/v1/users/:userId/answers // hmmm... what a mess. I must create one for threads, then!
// @access Public
exports.getAnswers = async (req, res, next) => {
  console.log(req.params);
  if (req.params.threadId) {
    console.log('The request comes from threads');
    const answers = await Answer.find({ thread: req.params.threadId });
    res.status(200).json({
      success: true,
      data: answers
    })
  } else if (req.params.userId) {
    console.log('The request comes from users');
    const answers = await Answer.find({ author: req.params.userId });
    res.status(200).json({
      success: true,
      data: answers
    });
  } else {
    console.log('Just get the fucking answers');
    const answers = await Answer.find()
    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    })
  }
  next();
};
