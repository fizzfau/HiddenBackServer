const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

router.post('/deleteAccount', authenticate, (req, res) => {
    CoffeeCredits.findOneAndDelete({userId: req.user.userId})
    .exec()
    .then(user => {
        User.findOneAndDelete({userId: req.user.userId})
        .exec()
        .then(user => {
            res.status(200).json({})
        })
        .catch(err => {
            res.status(401).json({
                message: err
            })
        })
    })
    .catch(err => {
        res.status(401).json({
            message: err
        })
    })
});

module.exports = router;