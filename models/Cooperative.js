const mongoose = require('mongoose');

const cooperativechema = new mongoose.Schema({
    cooperativeId: String,
    stats: String,
    coopDriverQueue: String,
    name: String,
});

const Cooperative = mongoose.model('cooperative', cooperativechema);
module.exports = Cooperative;