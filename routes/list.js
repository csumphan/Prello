var express = require('express');
var mongoose = require('mongoose');
var List = require('../models/list');

var router = express.Router();


//var List = mongoose.model('List', {
//    title: String,
//    cards: Array,
//    lid: String,
//    key: String,
//});


/* GET home page. *///dont need next its use for middleware
router.get('/', function(req, res, next) {

  List.find(function (err, list) {
    if (err) return console.log(err);
    res.json(list);
})
});

router.post('/', function(req, res) {
    var newList = new List({
        title: req.body.title,
        cards: req.body.cards,
        lid: req.body.lid,
        key: req.body.key

    });


    newList.save(function (err, list) {
    if (err) {
        return console.log(err);
    } else {
        res.json(list);
    }
});

    });

router.delete('/:lid', function(req, res){
    console.log()
    console.log(req.params.lid);

    List.findByIdAndRemove(req.params.lid, function(err, lid){
       if(err) {
           return console.log(err);
       }
        res.send();
    });

    res.send();
});

router.patch('/:lid', function(req, res){
    List.findById(req.params.lid, function(err, query){
        if(err){
            console.log(err);
        }
        console.log("Patch query: " + query);
        for(var i in req.body) {
            if(i in query) {
                query[i] = req.body[i];
            }
        }
        query.save(function(err, list){
            if(err){
                console.log(err);
            }
            res.json(list);
        });

    });

});

router.post('/:lid/card', function(req, res){
    List.findById(req.params.lid, function(err, query){
        if(err) {
            console.log(err);
        }
        req.body._id = mongoose.Types.ObjectId();
        req.body.labels = JSON.parse(req.body.labels);
        req.body.members = JSON.parse(req.body.members);
        req.body.comments = JSON.parse(req.body.comments);
        query.cards.push(req.body);
        console.log('labels then members');
        console.log(req.body.labels);
        console.log(typeof req.body.labels);
        console.log(req.body.members);
        console.log(typeof req.body.members);
        query.save(function(err,list){
            if(err){
                console.log(err);
            }
            res.json(query);
        });
    });
});

router.delete('/:lid/card/:cid', function(req, res){
    List.findById(req.params.lid, function(err, query){
        if(err) {
            console.log(err);
        }

        for(var x=0; x < query.cards.length; x++) {

            if(query.cards[x]._id.toString() === req.params.cid){
                query.cards.splice(x,1);

                break;
            }
        }

        query.save(function(err,list){
           if(err){console.log(err);}

            res.json(list);
        });
    });
});

router.patch('/:lid/card/:cid', function(req, res){
    List.findById(req.params.lid, function(err, query){
        if(err){
            console.log(err);
        }
        console.log('LOLOL');
        console.log(query.cards[0].labels);
        console.log(query.cards[0].members);
        console.log(req.labels);
        console.log(req.members);
        for(var x = 0; x < query.cards.length; x++) {
            var updateCard = query.cards[x];
            if(updateCard._id.toString() === req.params.cid) {
                for(var i in req.body) {
                    if(i in updateCard) {
                        console.log(i);
                        if(i == 'members' || i == 'labels' || i=='comments') {
                            console.log('im a members or labels');
                            console.log(JSON.parse(req.body[i]));
                            console.log(typeof JSON.parse(req.body[i]))
                            updateCard[i] = JSON.parse(req.body[i]);
                        }
                         else {
                            updateCard[i] = req.body[i];
                         }
                    }
                }

            query.cards.set(x,updateCard);
            break;
            }
        }

        query.save(function(err,list){
           if(err){console.log(err);}

            res.json(list);
        });
    });
});



module.exports = router;
