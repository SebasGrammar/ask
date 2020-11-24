const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getThreads,
  getThread,
  createThread,
  updateThread,
  saveThread,
  test
} = require('../controllers/threads');

const Thread = require('../models/Thread');
const advancedResults = require('../middleware/advancedResults');

const { update } = require('../models/User');
const { protect } = require('../middleware/auth');

// Resource routes
const answerRouter = require('./answers');

// Re-route into other resouce routes
router.use('/:threadId/answers', answerRouter); // When you do this, you have to include the mergeParams: true option
// in the other route (answers in this case). Otherwise, this reroute won't work!

// router.route('/').get(getThreads); // this is both /users/:userId/threads and /threads because of mergeParams.

// router.route('/:id').get(getThread).post(createThread); // This can't be! the author of the thread has to come from somewhere else!

router
  .route('/')
  .get(advancedResults(Thread), getThreads)
  .post(protect, createThread); // this is both /users/:userId/threads and /threads because of mergeParams.

router.get('/test', test);

router
  .route('/:id')
  .get(getThread)
  .post(protect, saveThread)
  .put(protect, updateThread);

module.exports = router;
