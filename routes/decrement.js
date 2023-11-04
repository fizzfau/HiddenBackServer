const express = require('express');
const router = express.Router();
const CoffeeCredits = require('../models/CoffeeCredits');
const authenticate = require('../middleware/authenticate');

router.get('/decrementCoffee', (req, res) => {
    CoffeeCredits.findOne({userId: req.body.id})
    .exec()
    .then(user => {
        req.body.credits = parseInt(req.body.credits);
        if (user.coffee - req.body.credits >= 0) {
            user.coffee -= 1;
        } else {
            res.status(401).json({
                message: "Not enough coffee"
            })
        }
        user.save();
        res.status(200).json({})
    })
    .catch(err => {
        res.json({
            message: err
        })
    })
});

module.exports = router;