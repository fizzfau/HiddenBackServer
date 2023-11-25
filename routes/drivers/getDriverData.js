const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Jobs = require('../../models/Jobs');
const authenticate = require('../../middleware/authenticate');

router.get('/getDriverData', authenticate, (req, res) => {
    User.findOne({userId: req.user.userId})
    .exec()
    .then(user => {
        console.log(11, user, typeof user.userId)
        Jobs.find({job_driver_id: user.userId})
        .exec()
        .then(jobs => {
            res.status(200).json({
                name: user.name,
                plate: user.plate,
                userId: user.userId,
                coopId: user.coopId,
                jobs: jobs
            })
        })
        .catch(err => {
            res.json({
                message: err
            })
        })
    })
    .catch(err => {
        res.json({
            message: err
        })
    })
});

module.exports = router;