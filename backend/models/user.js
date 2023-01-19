const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('User', schema, 'user')