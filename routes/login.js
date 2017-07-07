var express = require('express');
var mongoose = require('mongoose');
var LoginInfo = require('../models/loginInfo');
var sequelize = require('../db');
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
    var body = req.body;
    var query = `INSERT INTO users(username, email, password) VALUES
                ('${body.username}', '${body.email}', '${body.password}');
    `;
    sequelize.query(query, {type: sequelize.QueryTypes.INSERT})
    .then(function(user) {
        console.log(user);
    })
    .catch(function(e) {
        console.log(e);
    })
    ;
  // var newAcc = new LoginInfo({
  //     username: req.body.username,
  //     password: req.body.password,
  //     email: req.body.email,
  // });
  //
  // newAcc.save(function(err,acc){
  //     if(err){
  //         return console.log(err);
  //     }
  //
  //     res.json(acc);
  // });
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
    //SELECT <columns>
    console.log(req.body);
    var body = req.body;
    var query = `SELECT id, username, email
        FROM users
        WHERE username='${body.username}'
        AND password='${body.password}'`;

        sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
        .then(function(user) {
            console.log(user);
            if(user.length > 0) {

                req.session.user = user[0];
                req.user = user[0];
                console.log(req.session.user);
                res.redirect('/boards');
            }

            //res.send({redirect: '/boards'});
        })
        .catch(function(e) {
            console.log(e);
        })
        ;
    // LoginInfo.findOne({username: req.body.username}, function(err, user){
    //     if(!user) {
    //         console.log('Invalid Password/Username');
    //         res.render('login',{});
    //     }
    //     else {
    //         if(req.body.password === user.password){
    //
    //             req.session.user = user;
    //             res.redirect('/boards');
    //             //res.send({redirect: '/boards'});
    //             console.log("You're in... Redirecting to boards");
    //         }
    //         else {
    //             console.log('2Invalid Password/Username');
    //             res.render('login',{});
    //     }
    //
    // }
    // });
});

router.get('/signout', function(req, res){
    req.session.reset();
    res.send({redirect: '/'});
});

module.exports = router;
