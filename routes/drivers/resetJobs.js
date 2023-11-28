const express = require('express');
const router = express.Router();
const Jobs = require('../../models/Jobs');

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