const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

router.post('/deleteAccount', authenticate, (req, res) => {
    CoffeeCredits.findOne({userId: req.user.userId})
    .exec()
    .then(user => {
        user.remove();
    })
    .catch(err => {
        res.json({
            message: err
        })
    })
    User.findOne({_id: req.user.userId})
    .exec()
    .then(user => {
        user.remove();
        res.json({
            message: "Account deleted"
        })
    })
    .catch(err => {
        res.json({
            message: err
        })
    })
});

module.exports = router;