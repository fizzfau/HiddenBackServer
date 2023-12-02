const Jobs = require('../../models/Jobs');
const Cooperative = require('../../models/Cooperative');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');

const express = require('express');
const router = express.Router();

router.post('/createJob', authenticate, (req, res) => {
    const {isAdmin, coopId} = req.user;
    console.log(10, isAdmin, coopId);
    if (isAdmin) {
        const job_details = JSON.stringify(req.body);
        const job_coop_id = coopId;
        const job_listType = "active";
        const job_listStatus = "listed";
        const claimedAt = null;
        const job_id = CreateJobId();
        const job_driver_id = null;
        const job = new Jobs({
            job_id,
            job_details,
            job_coop_id,
            job_driver_id,
            job_listType,
            job_listStatus,
            claimedAt,
        });
        job.save().then(result => {
            res.status(200).json({
                success: true,
                message: 'İş oluşturuldu!',
                job: result,
            });
        }).catch(err => {
            res.status(200).json({
                success: false,
                message: 'İş oluşturulamadı!',
                err,
            });
        });
    }
});
        
function CreateJobId() {
    let id;
    while (!id) {
        id = Math.floor(Math.random() * 100000000);
        Jobs.findOne({job_id: id}).exec().then(job => {
            if (job) {
                id = null;
            }
        });
    }
    return id;
}

module.exports = router;