var express = require('express');
var mongoose = require('mongoose');
var LoginInfo = require('../models/loginInfo');

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
      password: req.body.password,
      email: req.body.email,
  });

  newAcc.save(function(err,acc){
      if(err){
          return console.log(err);
      }

      res.json(acc);
  });
});

router.post('/signin', function(req,res){
    console.log(req.body);
    LoginInfo.findOne({username: req.body.username}, function(err, user){
        if(!user) {
            console.log('Invalid Password/Username');
            res.render('login',{});
        }
        else {
            if(req.body.password === user.password){

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
