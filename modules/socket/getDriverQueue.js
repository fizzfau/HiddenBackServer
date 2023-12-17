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

function AddUserToQueue(userData) {
    queue.push(userData);
}
//
function RemoveFromQueue(plate) {
    if (currentUser.user.plate == plate) {
        queueIndex++;
        if (queueIndex >= queue.length) {
            queueIndex = 0;
        }
        currentUser = {
            user: queue[queueIndex],
            time: new Date().getTime(),
        };
        const io = getIo();
        io.emit('queueInfo', {currentUser: currentUser.user, queueIndex, timeDiff: 0});
    }
    for (let i = 0; i < queue.length; i++) {
        console.log(19, plate, queue[i].plate);
        if (queue[i].plate == plate) {
            queue.splice(i, 1);
            break;
        }
    }
}
    


Cooperative.findOne({cooperativeId: "12345"}).exec().then(cooperative => {
    const unDetailed = JSON.parse(cooperative.coopDriverQueue);
    for (i in unDetailed) {
        console.log(11, i, unDetailed[i]);
        User.findOne({userId: unDetailed[i]}).exec().then(user => {
            if (user) {
                queue.push({
                    name: user.name,
                    plate: user.plate,
                    userId: unDetailed[i]
                });
            }
        })
    }
    setTimeout(() => {
        currentUser = {
            user: queue[0],
            time: new Date().getTime(),
        };
        console.log(22, queue);
        StartQueue();
    }, 1000);
});

const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const { set } = require('mongoose');

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
                io.emit('queueInfo', {currentUser: currentUser.user, queueIndex, timeDiff: 0, queueLen: queue.length});
            }
        }
    }, 30000);
}

// Etkileşimde bulunma endpoint'i
router.post('/takeJob', authenticate, (req, res) => {
    const plate = req.user.plate;
    if (currentUser.user.plate == plate) {
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
    for (let i = 0; i < queue.length; i++) {
        if (queue[i].plate == plate) {
            console.log(57, i);
            res.status(200).json({
                success: true,
                index: i,
                queueLen: queue.length,
            })
            return
        }
    }
    res.status(200).json({
        success: false,
        index: -1,
        queueLen: queue.length,
    }) 
});

function takeJob(req, res) {
    const id = req.body.id;
    const driverId = req.user.userId;
    console.log(127, id, driverId)
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
            console.log(140, job)
            if (job.job_listStatus === 'claimed') {
                return res.status(200).json({
                    success: false,
                    message: 'Bu iş zaten alınmış!'
                })
            }

            job.job_listStatus = 'claimed';
            job.job_driver_id = driverId;
            job.claimedAt = Date.now();

            console.log(152, job.claimedAt)

            job.save();

            User.findOneAndUpdate({
                userId: driverId
            }, {
                lastClaimedJob: id,
                lastClaimedDate: Date.now()
            }).exec()
            
            console.log(163, queue)

            queue.push(currentUser);
            queue.splice(queueIndex, 1);
            
            console.log(167)
            console.log(ReturnDriverIdsAsList())

            // console.log(168, ReturnDriverIdsAsList(queue))

            // Cooperative.findOneAndUpdate({
            //     cooperativeId: req.user.coopId
            // }, {
            //     coopDriverQueue: JSON.stringify(ReturnDriverIdsAsList(queue))
            // }).exec()

            console.log(173, "save")

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

router.get('/getdriverids', function(req, res){
    console.log(202, ReturnDriverIdsAsList())
    res.send("test")
})

function getCurrentQueue() {
    return currentUser;
}

function getQueueIndex() {
    return queueIndex;
}

function getQueueLen() {
    return queue.length;
}

function ReturnDriverIdsAsList() {
    let queueIds = []
    console.log(220, queue)
    for (i = 0; queue.length; i++) {
        if (queue[i]) {
            console.log(31, queue[i])
            queueIds.push(queue[i].userId)
        }
    }
    console.log(227)
    // console.log(226, queueIds)
    return queueIds
}



const Queue = router;
module.exports = {
    Queue,
    getCurrentQueue,
    getQueueIndex,
    AddUserToQueue,
    RemoveFromQueue,
    getQueueLen
}