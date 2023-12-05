const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Jobs = require('../../models/Jobs');
const authenticate = require('../../middleware/authenticate');

router.delete('/deleteAccount', authenticate, (req, res) => {
    User.deleteOne({userId: req.user.userId})
    .exec()
    .then(user => {
        Jobs.deleteMany({job_driver_id: req.user.userId})
        .exec()
        .then(jobs => {
            res.status(200).json({
                message: 'Hesabınız başarıyla silindi.'
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