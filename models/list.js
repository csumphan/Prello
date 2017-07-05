var mongoose = require('mongoose');

module.exports = mongoose.model('List', {
    title: String,
    cards: Array,
    lid: String,
    key: String,
});