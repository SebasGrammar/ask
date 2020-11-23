const { findByIdAndUpdate } = require('../models/Thread');
const Thread = require('../models/Thread');
const User = require('../models/User');
const Answer = require('../models/Answer');

// Or should it be /api/v1/users/:userId/threads ? DONE. Did this by merging parameters.

// @desc   Get threads created by a specific user
// @route  GET /api/v1/threads
// @route  GET /api/v1/users/:userId/threads -> should I add /saved, /created and /answered? YES!
// @access Public
exports.getThreads = async (req, res) => {
  if (req.params.username) {
    // TEST

    // const user = await User.findById(req.params.username).select(
    //   'firstName lastName'
    // );

    const user = await User.findOne({ username: req.params.username }).select(
      'firstName lastName'
    );

    /*******TEST ABOVE **********/
    const threads = await Thread.find({
      author: req.params.username
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
  // req.body.author = req.params.id; // This is of type ObjectId // NO!

  // const sebas = '5faf1130b8e5df2bccaa87d4'; // signed in user, of course! gotta deal with this later.

  req.body.author = req.user.username; // This is of type ObjectId

  const user = await User.findById(req.user._id); // I believe I should do this in the model itself, not here

  const thread = await Thread.create(req.body); // Need to create an error handler

  user.askedQuestions.push(thread._id);

  res.status(200).json({
    success: true,
    author: req.body.author,
    data: thread
  });
};

// @desc   Create thread
// @route  PUT /api/v1/threads/:id
// @access Private
exports.updateThread = async (req, res) => {
  const thread = await Thread.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: thread
  });
};

// // @desc   Save thread // What about answer Thread? it should definitely be a post request, too! it could be something like... if req.body, that means it's an answer. Otherwise, it's a save therad request.
// // @route  POST /api/v1/threads/:id
// // @access Private
// exports.saveThread = async (req, res) => {
//   const loggedInUser = '5faf1130b8e5df2bccaa87d4'; // Sebas

//   let user = await User.findById(loggedInUser);

//   user.savedQuestions.push(req.params.id);

//   // user = await user.populate({
//   //   path: 'savedQuestions'
//   // });

//   // const savedQuestions = await user.savedQuestions.populate({
//   //   path: 'savedQuestions'
//   // });

//   res.status(200).json({
//     success: true,
//     data: await user.populate({
//       path: 'savedQuestions'
//     })
//   });

//   // Here's how to do the same with then:
//   // user.populate({ path: 'savedQuestions' }).then((data) => {
//   //   res.status(200).json({
//   //     success: true,
//   //     data
//   //   });
//   // });
// };

// @desc   Save thread // What about answer Thread? it should definitely be a post request, too! it could be something like... if req.body, that means it's an answer. Otherwise, it's a save therad request.
// @route  POST /api/v1/threads/:id
// @access Private
exports.saveThread = async (req, res, next) => {
  // const loggedInUser = '5faf1130b8e5df2bccaa87d4'; // Sebas
  const loggedInUser = req.user.id; // Sebas

  let user = await User.findById(loggedInUser);

  console.log(user);
  // let user = await User.findById(loggedInUser).select('savedQuestions');

  // console.log(user);

  if (!Object.keys(req.body).length) {
    // Check if req.body is empty. If it is, that means the user clicked on save thread (or something equivalent).
    // The fact that it's empty means, of course, that it's not an answer.
    console.log('The body is empty. Just save the thread. ');
    // user.savedQuestions.push(req.params.id); // More like saved threads!!

    if (!user.savedQuestions.includes(req.params.id)) {
      await user.updateOne({
        $push: {
          savedQuestions: req.params.id
        }
      });
    }

    // console.log(
    //   await Thread.findOne({ // the submittedAnswers array is fucking empty! DAMN! fuck...
    //     _id: req.params.id
    //   })
    // );

    // console.log(
    //   await Thread.findOne({
    //     _id: req.params.id
    //   })
    // );

    //console.log(populatedThreads);

    // await user.save(); // Since this is a save request, the middleware that runs on 'save' is going to run here! damn..
    // Use this option instead:
    // await user.save({ validateBeforeSave: false });

    // console.log(
    //   await user.populate({
    //     path: 'savedQuestions'
    //   })
    // );

    // res.status(200).json({
    //   success: true,
    //   data: await user.populate({
    //     path: 'savedQuestions'
    //   })
    // });

    // res.status(200).json({
    //   success: true,
    //   data: await user.populate({
    //     path: 'savedQuestions'
    //   })
    // });

    // User.findById(req.user.id)
    //   .populate({ path: 'savedQuestions' })
    //   .then((data) => {
    //     console.log(data);
    //   }); // Well... this actually works.

    User.findById(req.user.id)
      .populate({ path: 'savedQuestions' })
      .then((data) => {
        res.status(200).json({
          success: true,
          data
        });
      });

    // res.status(200).json({
    //   success: true,
    //   data: await user.populate({
    //     path: 'savedQuestions'
    //   })
    // });
  } else {
    // Now... of course I have to find a way to save the answers, too. And for that, I'm gonna have to use an Answer model.
    // user.answeredQuestions.push(req.params.id); // More like answered threads!!!
    // // console.log(user.answeredQuestions);
    // // console.log(req.user.username);
    // // Come to think of it... I don't think it's a good idea to have question-related functionality here in the threads controller...

    // await user.save(); // This is going to trigger the middleware that runs on 'save', and I don't want that!

    if (!user.answeredQuestions.includes(req.params.id)) {
      await user.updateOne({
        $push: {
          answeredQuestions: req.params.id
        }
      });
    }

    res.status(200).json({
      success: true,
      data: await user.populate({
        path: 'answeredQuestions'
      })
    });
  }

  next();
};

// Get saved threads
// Get answered threads... still remaining.
