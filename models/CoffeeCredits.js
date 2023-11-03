const mongoose = require('mongoose');

const CoffeeCreditsSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User'
    },
    credits: {
        type: Number,
        default: 0
    },
    coffee: {
        type: Number,
        default: 0
    }
});

const CoffeeCredits = mongoose.model('CoffeeCredits', CoffeeCreditsSchema);
module.exports = CoffeeCredits;