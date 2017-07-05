var mongoose = require('mongoose');

var LoginInfo = require('../models/loginInfo');
var List = require('../models/list');

module.exports = mongoose.model('Board',{
    //_user: {type: Schema.Types.ObjectId, ref: 'LoginInfo'},
    title: String,
    board: [{type: Schema.Types.ObjectId, ref: 'List'}]
});
