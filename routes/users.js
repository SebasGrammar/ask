const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getLoggedInUser
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');

// router.use(protect); // Anything below this is going to use protect
// router.use(authorize('admin')); // same here!
// // If I decide to go with what's above, then nothing's gonna work if it doesn't 'comply' with whatever the middleware
// // requires (that the user is logged in, that it's an admin... etc (whatever we want)).

// Resource routes
const threadRouter = require('./threads');
const answerRouter = require('./answers');

// Re-route into other resouce routes
router.use('/:username/threads', threadRouter);
router.use('/:username/answers', answerRouter);
router.use('/:username/answers/:threadId', answerRouter);

router.route('/').get(getUsers).post(protect, authorize('admin'), createUser);
router.route('/me').get(protect, getLoggedInUser);
router
  .route('/:username')
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
