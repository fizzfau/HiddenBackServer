const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminUserSchema = new Schema({
    coopId: String,
    password: String,
    name: String,
    userName: String
}, {collection: "admin"});

module.exports = mongoose.model('AdminUser', AdminUserSchema);