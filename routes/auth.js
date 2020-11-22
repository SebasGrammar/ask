const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

const { register, login, logout } = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);

module.exports = router;
