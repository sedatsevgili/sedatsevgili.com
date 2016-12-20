var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expiresIn: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Token', TokenSchema);