const Cooperative = require('../../models/Cooperative');
const Jobs = require('../../models/Jobs');
const User = require('../../models/User');
const { socket, getIo } = require('./connect');

let queue = [];

Cooperative.findOne({cooperativeId: "12345"}).exec().then(cooperative => {
    queue = JSON.parse(cooperative.coopDriverQueue);
    currentUser = queue[0];
    StartQueue();
});

const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
let queueIndex = 0;
let currentUser = null;

function StartQueue() {
    const io = getIo()
    setInterval(() => {
        if (queue.length > 0) {
            if (currentUser !== null) {
                queueIndex++;
                if (queueIndex >= queue.length) {
                    queueIndex = 0;
                }
            }
            currentUser = queue[queueIndex];
            if (io) {
                io.emit('queueInfo', currentUser);
            }
        }
    }, 30000);
}

// Etkileşimde bulunma endpoint'i
router.post('/takeJob', authenticate, (req, res) => {
    const plate = req.user.plate;
    if (currentUser.plate == plate) {
        takeJob(req, res);
    } else {
        res.status(200).json({
            success: false,
            message: 'Sıradaki kullanıcı değilsiniz.!',
        })
    }
});

function takeJob(req, res) {
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
            
            queue.push(currentUser);
            queue.splice(queueIndex, 1);

            Cooperative.findOneAndUpdate({
                cooperativeId: req.user.coopId
            }, {
                coopDriverQueue: JSON.stringify(queue)
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
}

router.get('/queue', (req, res) => {
    res.send(queue);
});

router.get('/getCurrentQueue', (req, res) => {
    res.send(currentUser);
});

module.exports = router;