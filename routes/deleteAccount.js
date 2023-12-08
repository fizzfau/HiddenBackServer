const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cooperative = require('../models/Cooperative');
const Jobs = require('../models/Jobs');
const authenticate = require('../middleware/authenticate');
const { RemoveFromQueue } = require('../modules/socket/getDriverQueue');

router.delete('/deleteAccount', authenticate, (req, res) => {
    User.deleteOne({ userId: req.user.userId })
        .exec()
        .then(user => {
            Cooperative.findOne({ cooperativeId: req.user.coopId })
                .exec()
                .then(coop => {
                    let queue = JSON.parse(coop.coopDriverQueue);
                    let index = queue.indexOf(req.user.userId);
                    queue.splice(index, 1);
                    Cooperative.findOneAndUpdate({ cooperativeId: req.user.coopId }, { coopDriverQueue: JSON.stringify(queue) })
                        .exec()
                        .then(() => {
                            RemoveFromQueue(req.user.plate);
                            res.status(200).json({
                                message: 'User deleted'
                            })
                        })
                        .catch(err => {
                            res.json({
                                message: err
                            })
                        })
                })
        })
        .catch(err => {
            res.json({
                message: err
            })
        })
        .catch(err => {
            res.json({
                message: err
            })
        })
});


module.exports = router;