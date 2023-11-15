const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Jobs = require('../../models/Jobs');
const authenticate = require('../../middleware/authenticate');

router.get('/getDriverData', authenticate, (req, res) => {
    User.findOne({userId: req.user.userId})
    .exec()
    .then(user => {
        Jobs.find({job_driver_id: req.user.userId})
        .exec()
        .then(jobs => {
            console.log(JSON.parse(jobs[1].job_details).startLocation)
            
            res.json({
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