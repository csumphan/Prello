var express = require('express');
var mongoose = require('mongoose');

var LoginInfo = require('../models/loginInfo');
var UserHash = require('../models/userhash');

//md5 hashing library
var md5 = require('js-md5');

var router = express.Router();


router.get('/', function(req, res){
    LoginInfo.find(function(err, acc){
        if(err){
            console.log(err);
        }
        res.json(acc);
    });
});

router.post('/', function(req, res){

  var newAcc = new LoginInfo({
      username: req.body.username,
      password: md5(req.body.password),
      email: req.body.email,
  });

  newAcc.save(function(err,acc){
      if(err){
          console.log(err);
      }
      var newUserHash = new UserHash({
          hashID: md5(acc.username),
          userID: acc._id
      });

      newUserHash.save(function(err, user){
          if(err){
              console.log(err);
          }
          res.json(acc);
      });


  });
});

router.delete('/:userid', function(req, res){
    LoginInfo.findByIdAndRemove(req.params.userid, function(err, user){
        if(err) {
            return console.log(err);
        }
        res.send();
    });

    res.send();
});
router.post('/signin', function(req,res){
    console.log(req.body);
    LoginInfo.findOne({username: req.body.username}, function(err, user){
        if(!user) {
            console.log('Invalid Password/Username');
            res.render('login',{});
        }
        else {
            if(md5(req.body.password) === user.password){

                req.session.user = user;
                res.redirect('/boards');
                //res.send({redirect: '/boards'});
                console.log("You're in... Redirecting to boards");
            }
            else {
                console.log('2Invalid Password/Username');
                res.render('login',{});
        }

    }
    });
});

router.get('/signout', function(req, res){
    req.session.reset();
    res.send({redirect: '/'});
});

module.exports = router;
