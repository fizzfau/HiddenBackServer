const express = require('express');
const router = express.Router();
const Jobs = require('../../models/Jobs');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');

router.post('/takeJob', authenticate, (req, res) => {
    const id = req.body.id;
    const driverId = req.user.userId;

    Jobs.findOne({
        job_id: id,
        job_coop_id: req.user.coopId,
    })
        .exec()
        .then(job => {
            if (!job) {
                return res.status(200).json({
                    success: false,
                    message: 'Böyle bir iş bulunamadı!'
                })
            }
            if (job.job_listStatus === 'claimed') {
                return res.status(200).json({
                    success: false,
                    message: 'Bu iş zaten alınmış!'
                })
            }

            job.job_listStatus = 'claimed';
            job.job_driver_id = driverId;
            job.claimedAt = Date.now();

            job.save();

            User.findOneAndUpdate({
                userId: driverId
            }, {
                lastClaimedJob: id,
                lastClaimedDate: Date.now()
            }).exec()

            res.status(200).json({
                success: true,
                message: 'İşi aldın!',
            })
        })
        .catch(err => {
            res.json({
                message: err
            })
        })

});

router.get('/resetJobs', (req, res) => {
    Jobs.updateMany({}, {
        $set: {
            job_listStatus: 'active',
            job_driver_id: 'false'
        }
    })
        .exec()
        .then(result => {
            res.json({
                success: true,
                message: 'Jobs reseted!'
            })
        })
        .catch(err => {
            res.json({
                message: err
            })
        })
})



module.exports = router;