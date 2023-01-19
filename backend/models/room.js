const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timerInSeconds: {
        type: Number,
        required: false,
        default: null,
    },
    cards: {
        type: Array,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Room', schema, 'room')