const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getThreads,
  getThread,
  createThread,
  updateThread,
  saveThread
} = require('../controllers/threads');
const { update } = require('../models/User');

// router.route('/').get(getThreads); // this is both /users/:userId/threads and /threads because of mergeParams.

// router.route('/:id').get(getThread).post(createThread); // This can't be! the author of the thread has to come from somewhere else!

router.route('/').get(getThreads).post(createThread); // this is both /users/:userId/threads and /threads because of mergeParams.

router.route('/:id').get(getThread).post(saveThread).put(updateThread);

module.exports = router;
