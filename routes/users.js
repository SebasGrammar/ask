const express = require('express');
const router = express.Router();

const { getUsers, getUser, createUser } = require('../controllers/users');

router.route('/').get(getUsers).post(createUser);

router.route('/:id').get(getUser);

module.exports = router;
