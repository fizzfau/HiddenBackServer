const mongoose = require('mongoose');

const CooperativeSchema = new mongoose.Schema({
    cooperativeId: String,
    stats: String,
    coopDriverOrder: String,
    name: String,
});

const Cooperative = mongoose.model('cooperative', CooperativeSchema);
module.exports = Cooperative;