const express = require('express');
const router = express.Router();

const { register, login } = require('../Authentication/AuthController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;