const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const authenticate = require('../middleware/authenticate');

router.get('/incrementCredit', authenticate, (req, res) => {
    CoffeeCredits.findOne({userId: req.user.userId})
    .exec()
    .then(user => {
        if (user.coffee >= 1) {
            user.coffee -= 1;
        } else {
            res.status(401).json({
                message: "Not enough coffee"
            })
        }
        user.save();
        res.json({
            credits: user.credits,
            coffee: user.coffee,
            name: req.user.name,
            userId: req.user.userId
        })
    })
    .catch(err => {
        res.json({
            message: err
        })
    })
});

module.exports = router;