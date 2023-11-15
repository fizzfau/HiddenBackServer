const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = Schema({
    job_id: String,
    job_details: String,
    job_coop_id: String,
    job_driver_id: String,
    job_listType: String,
    job_listStatus: String,
});

module.exports = mongoose.model('jobs', JobSchema);