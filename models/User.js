const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    phone: String,
    password: String,
    userId: String,
    refCode: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
