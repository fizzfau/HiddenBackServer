const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');

router.post('/deleteAccount', authenticate, (req, res) => {
    console.log(7, req.user.userId);
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
        console.log(41, err);
        res.status(401).json({
            message: err
        })
    })
});

module.exports = router;