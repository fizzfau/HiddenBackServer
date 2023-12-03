const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    plate: String,
    password: String,
    userId: String,
    coopId: String,
    lastClaimedJob: String,
    lastClaimedDate: Date,
    confirmed: { type: Boolean, default: false },
    lastEntered: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('drivers', UserSchema);
