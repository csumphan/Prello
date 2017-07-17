//route that manages the userHash collection

var express = require('express');
var mongoose = require('mongoose');

var UserHash = require('../models/userhash');
var LoginInfo = require('../models/loginInfo');

var md5 = require('js-md5');

var router = express.Router();

//this route hashes the new password and replace the old password.
//this route also rehash the old hashID (makes old link expired)
router.post('/', function(req,res){
    UserHash.findOne({hashID: req.body.hid}, function(err, hash){
        if(!hash) {
            console.log('Hash does not exist');
        }
        else {
            LoginInfo.findOne({_id: hash.userID}, function(err,user){
                if(!user) {
                    console.log('user does not exist');
                }
                else{
                    user.password = md5(req.body.password);
                    user.save(function(err, newUser){
                        if(err) {
                            console.log(err);
                        }
                        hash.hashID = md5(hash.hashID);

                        hash.save(function(err, newUser){
                            if(err) {
                                console.log(err);
                            }

                            res.send({
                                confirm: '/reset/confirm'
                            });
                        });
                    });
                }
            });
        }
    });
});


router.get('/checkemail', function(req,res){
    res.redirect('/forgotpassword');

});

router.get('/confirm', function(req, res){
    res.render('resetconfirmation');
});

//route checks if email exists in collection.
//if not a message is sent to client
//otherwise create reset link page
router.post('/checkemail', function(req,res){
    LoginInfo.findOne({email: req.body.email}, function(err, user){
        if(!user){
            res.render('forgotpassword',{
                emailError: 'Error: Email does not exist.'
            })
        }
        else {
            UserHash.findOne({userID: user._id}, function(err, hash){
                if(err) {
                    console.log(err);
                }
                console.log('werwlerwegdfg');
                console.log(hash.hashID);

                res.render('resetlink', {
                    url: '/reset/' + hash.hashID,
                });
            });


        }
    });
});

//route handles expired links. Will check to see if hash exists in
//collection. If not redirect to homepage, Other wise redirect to
//reset pasword page.
router.get('/:hashID', function(req, res){
    UserHash.findOne({hashID: req.params.hashID}, function(err,hash){
        if(!hash) {
            res.redirect('/');
        }
        else {
            res.render('resetPassword');
        }
    });
});



module.exports = router;
