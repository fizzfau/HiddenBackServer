const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

router.post('/deleteAccount', authenticate, (req, res) => {
    
});

module.exports = router;