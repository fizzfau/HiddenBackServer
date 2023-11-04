const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const authenticate = require('../middleware/authenticate');

router.post('/incrementCredit', (req, res) => {
    console.log(7, req.body);
    CoffeeCredits.findOne({userId: req.body.id})
    .exec()
    .then(user => {
        req.body.credits = parseInt(req.body.credits);
        user.credits += req.body.credits;
        console.log(31, user.credits, req.body.credits);
        if (user.credits >= 10) {
            console.log(14)
            user.coffee += 1;
            user.credits = 0;
        }
        user.save();
        res.status(200).json({})
    })
    .catch(err => {
        console.log(41, err);
        res.status(401).json({
            message: err
        })
    })
});

module.exports = router;