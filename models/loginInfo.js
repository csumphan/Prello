var mongoose = require('mongoose');

module.exports = mongoose.model('LoginInfo', {
    username: String,
    password: String,
    email: String,
    boards: [{ type: mongoose.Schema.ObjectId, ref: 'Board' }]
});
