const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    plate: String,
    password: String,
    userId: String,
    coopId: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('drivers', UserSchema);
