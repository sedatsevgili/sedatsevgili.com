var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    expires_in: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Token', TokenSchema);