const Cooperative = require('../../models/Cooperative');
const Jobs = require('../../models/Jobs');
const User = require('../../models/User');
const { socket, getIo } = require('./connect');

let queue = [];
let queueIndex = 0;
let currentUser = {
    user: queue[queueIndex],
    time: new Date().getTime(),
};

Cooperative.findOne({cooperativeId: "12345"}).exec().then(cooperative => {
    queue = JSON.parse(cooperative.coopDriverQueue);
    currentUser = {
        user: queue[0],
        time: new Date().getTime(),
    };
    StartQueue();
});

const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');


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
            currentUser = {
                user: queue[queueIndex],
                time: new Date().getTime(),
            };
            if (io) {
                io.emit('queueInfo', {currentUser: currentUser.user, queueIndex, timeDiff: 0});
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
            message: 'Sıradaki kullanıcı değilsiniz!',
        })
    }
});

router.get('/getMyQueueIndex', authenticate, (req, res) => {
    const plate = req.user.plate;
    console.log(53, plate);
    for (let i = 0; i < queue.length; i++) {
        if (queue[i].plate == plate) {
            console.log(57, i);
            res.status(200).json({
                success: true,
                index: i
            })
        }
    }
    res.status(200).json({
        success: false,
        index: -1
    }) 
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

function getCurrentQueue() {
    console.log(131, currentUser);
    return currentUser;
}

function getQueueIndex() {
    return queueIndex;
}

const Queue = router;
module.exports = {
    Queue,
    getCurrentQueue,
    getQueueIndex
}