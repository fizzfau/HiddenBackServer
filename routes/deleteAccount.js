const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Cooperative = require('../../models/Cooperative');
const Jobs = require('../../models/Jobs');
const authenticate = require('../../middleware/authenticate');

router.delete('/deleteAccount', authenticate, (req, res) => {
    User.deleteOne({userId: req.user.userId})
    .exec()
    .then(user => {
        Jobs.deleteMany({job_driver_id: req.user.userId})
        .exec()
        .then(jobs => {
            Cooperative.findOne({coopId: req.user.coopId})
            .exec()
            .then(coop => {
                let queue = JSON.parse(coop.coopDriverQueue);
                let index = queue.indexOf(req.user.userId);
                queue.splice(index, 1);
                Cooperative.findOneAndUpdate({cooperativeId: req.user.coopId}, {coopDriverQueue: JSON.stringify(queue)})
                    .exec()
                    .then(() => {
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