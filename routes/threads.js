const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getThreads,
  getThread,
  createThread
} = require('../controllers/threads');

router.route('/').get(getThreads); // this is both /users/:userId/threads and /threads because of mergeParams.

router.route('/:id').get(getThread).post(createThread);

module.exports = router;
