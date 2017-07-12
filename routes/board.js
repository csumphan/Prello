var express = require('express');
var mongoose = require('mongoose');

var Board = require('../models/board');
var LoginInfo = require('../models/loginInfo');

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
            LoginInfo.findOne({username: req.session.user.username}, function(err, user){
                if(err){
                    console.log(err);
                }
                user.boards.push(board._id);

                user.save(function(err, modUser){
                    if(err) {
                        console.log(err);
                    }

                });
            });
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


//returns all lists from the specified board id
router.get('/:bid', function(req, res){

    Board.findOne({_id: req.params.bid}, function(err, board){

    });
    Board.findOne({_id: req.params.bid}).populate('lists').exec(function(err, board){
        res.json(board.lists);
    });
});


//remove list id from lists attribute
router.delete('/:bid/list/:lid', function(req, res){

    Board.findOne({_id: req.params.bid}, function(err,board){

        if(err) {
            return console.log(err);
        }
        for(var x = 0; x < board.lists.length; x++) {
            if(req.params.lid === board.lists[x].toString()){

                board.lists.splice(x,1);
                break;
            }
        }
        board.save(function(err, modBoard){
            if(err){
                console.log(err);
            }
            res.send();
        });
    });
});
router.delete('/:bid', function(req, res){

    Board.findByIdAndRemove(req.params.bid, function(err, bid){
       if(err) {
           return console.log(err);
       }
        LoginInfo.findOne({_id: req.session.user._id}, function(err, user){
            if(err){
                console.log(err);
            }
            for(var x =0; x < user.boards.length; x++){
                if(user.boards[x].toString() === req.params.bid){
                    console.log('removed from user');
                    user.boards.splice(x,1);
                    break;
                }
            }
            user.save(function(err, modUser){
                if(err){
                    console.log(err);
                }
                res.send();
            });
        });
    });

    res.send();
});

module.exports = router;
