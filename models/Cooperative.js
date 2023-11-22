const mongoose = require('mongoose');

const cooperativechema = new mongoose.Schema({
    cooperativeId: String,
    stats: String,
    coopDriverOrder: String,
    name: String,
});

const Cooperative = mongoose.model('cooperative', cooperativechema);
module.exports = Cooperative;