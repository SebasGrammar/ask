const express = require('express');
const router = express.Router({ mergeParams: true }); // If you don't include this, then you won't be able to
// receive requests made from another resource that use this route, such as /:userId/answers.

const { getAnswers, submitAnswer } = require('../controllers/answers');

router.route('/').get(getAnswers).post(submitAnswer);

//router.route('/:threadId').get(getAnswers);

module.exports = router;
