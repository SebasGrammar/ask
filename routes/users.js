const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

// Resource routes
const threadRouter = require('./threads');

// Re-route into other resouce routes
router.use('/:userId/threads', threadRouter); // this is going to run at the root level in the threads router ('/').
// This would be the same as 'threads'. However, we are getting additional info from the 'parent route', which is 'users/:userId'.
// That is, we have access to 'users' and ':userId' from the root in threads.

// This is because we don't want routes that are not directly related to users here. It's better to use a re-router like we did above
// than to do what's below.
// router.route('/:id/threads').get(getThreads);

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
