const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const authenticate = require('../middleware/authenticate');

router.post('/incrementCredit', (req, res) => {
    console.log(7, req.body);
    CoffeeCredits.findOne({userId: req.body.id})
    .exec()
    .then(user => {
        user.credits += req.body.credits;
        if (user.credits >= 10) {
            user.coffee += 1;
            user.credits = 0;
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