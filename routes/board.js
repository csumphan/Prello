var express = require('express');
var mongoose = require('mongoose');
var Board = require('../models/board');

var router = express.Router();

router.post('/', function(req, res){
    var newBoard = new Board({
        title: req.body.title,
        lists: req.body.lists
    });

    newBoard.save(function(err,board){
        if(err) {
            return console.log(err);
        }
        else {
            res.json(board);
        }
    });
});

router.get('/', function(req, res){
  Board.find(function (err, board) {
    if (err) return console.log(err);
    res.json(board);
    });
});


router.delete('/:bid', function(req, res){

    Board.findByIdAndRemove(req.params.bid, function(err, bid){
       if(err) {
           return console.log(err);
       }
        res.send();
    });

    res.send();
});

module.exports = router;
