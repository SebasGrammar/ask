const Answer = require('../models/Answer');
const Thread = require('../models/Thread');
const User = require('../models/User');

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc   Get threads created by a specific user
// @route  GET /api/v1/answers
// @route  GET /api/v1/threads/:threadId/answers
// @route  GET /api/v1/threads/:threadId/:userId
// @access Public

exports.getAnswers = asyncHandler(async (req, res, next) => {
  if (req.params.username && req.params.threadId) {
    const answers = await Answer.find({
      author: req.params.username,
      thread: req.params.threadId
    });

    if (!answers) {
      return next(new ErrorResponse('No resources were found.', 404));
    }

    res.status(200).json({
      success: true,
      data: answers
    });
  } else if (req.params.threadId) {
    const answers = await Answer.find({ thread: req.params.threadId });

    if (!answers) {
      return next(new ErrorResponse('No resources were found.', 404));
    }

    res.status(200).json({
      success: true,
      data: answers
    });
  } else if (req.params.username) {
    const answers = await Answer.find({ author: req.params.username });

    if (!answers) {
      return next(new ErrorResponse('No resources were found.', 404));
    }

    res.status(200).json({
      success: true,
      data: answers
    });
  } else {
    const answers = await Answer.find();

    if (!answers) {
      return next(new ErrorResponse('No resources were found.', 404));
    }

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers
    });
  }
  next();
});

// exports.getAnswers = asyncHandler(async (req, res, next) => {
//   if (req.params.username && req.params.threadId) {
//     const answers = await Answer.find({
//       author: req.params.username,
//       thread: req.params.threadId
//     });

//     if (!answers) {
//       return next(new ErrorResponse('No resources were found.', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: answers
//     });
//   } else if (req.params.threadId) {
//     const answers = await Answer.find({ thread: req.params.threadId });

//     if (!answers) {
//       return next(new ErrorResponse('No resources were found.', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: answers
//     });
//   } else if (req.params.username) {
//     const answers = await Answer.find({ author: req.params.username });

//     if (!answers) {
//       return next(new ErrorResponse('No resources were found.', 404));
//     }

//     res.status(200).json({
//       success: true,
//       data: answers
//     });
//   } else {
//     const answers = await Answer.find();

//     if (!answers) {
//       return next(new ErrorResponse('No resources were found.', 404));
//     }

//     res.status(200).json({
//       success: true,
//       count: answers.length,
//       data: answers
//     });
//   }
//   next();
// });

// @desc   Submit answer to thread
// @route  POST /api/v1/threads/:threadId/answers
// @access Public

exports.submitAnswer = asyncHandler(async (req, res, next) => {
  req.body.author = req.user.username;
  req.body.thread = req.params.threadId;

  const thread = await Thread.findById(req.params.threadId);

  const answer = await Answer.create(req.body);

  res.status(200).json({
    success: true,
    data: answer
  });
});
