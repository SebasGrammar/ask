const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Anything below this is going to use protect
router.use(authorize('admin')); // same here!

// Resource routes
const threadRouter = require('./threads');
const answerRouter = require('./answers');

// Re-route into other resouce routes
router.use('/:username/threads', threadRouter);
router.use('/:username/answers', answerRouter);
router.use('/:username/answers/:threadId', answerRouter);

router.route('/').get(getUsers).post(createUser);

router.route('/:username').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
