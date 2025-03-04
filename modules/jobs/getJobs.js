const express = require('express');
const router = express.Router();
const Jobs = require('../../models/Jobs');
const authenticate = require('../../middleware/authenticate');

router.get('/getJobList', authenticate, (req, res) => {
    Jobs.find({
            job_coop_id: req.user.coopId,
            job_listStatus: req.body.job_listStatus || "active"
        })
        .exec()
        .then(jobList => {
            res.json(jobList)
        })
        .catch(err => {
            res.json({
                message: err
            })
        })

});

module.exports = router;