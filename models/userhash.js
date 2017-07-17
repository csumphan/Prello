//Model that represents connection between a unique hash and
//a single user.

var mongoose = require('mongoose');

module.exports = mongoose.model('UserHash', {
    hashID: String,
    userID: {type: mongoose.Schema.ObjectId, ref: 'LoginInfo'}
});
