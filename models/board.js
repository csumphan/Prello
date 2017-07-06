var mongoose = require('mongoose');

var LoginInfo = require('../models/loginInfo');
var List = require('../models/list');

module.exports = mongoose.model('Board',{

    title: String,
    lists: [{ type: mongoose.Schema.ObjectId, ref: 'List' }]
});
