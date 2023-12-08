const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = Schema({
    userName: String,
    coopId: String,
    action: String,
    logType: String,
    logDetails: String,
    logText: String,
    logDate: { type: Date, default: Date.now },
}, { collection: 'logs' });

module.exports = mongoose.model('logs', LogSchema);