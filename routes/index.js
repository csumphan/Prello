var express = require('express');
var router = express.Router();

var Board = require('../models/board');
var LoginInfo = require('../models/loginInfo');

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login.ejs');
});

router.get('/board/:bid', requireLogin, function(req, res, next) {
  //res.locals.user = req.user;
  LoginInfo.findOne({_id: req.user._id}).
      populate('boards').exec(function(err, user){

          Board.findOne({_id: req.params.bid}, function(err,board){
              var boardTitle = board.title;
              console.log(boardTitle);
              res.render('index', { title: 'Prello',
                                    cssFile: '/stylesheets/style3.css',
                                    script: 'javascripts/script3.js',
                                    navCSS: '/stylesheets/navbar.css',
                                    bid: req.params.bid,
                                    boards: user.boards,
                                    boardTitle: boardTitle
                                  });
          });

      });
});

router.get('/board', requireLogin, function(req, res, next) {
  //res.locals.user = req.user;

  res.render('index', { title: 'Prello',
                        cssFile: '/stylesheets/style3.css',
                        script: 'javascripts/script3.js',
                      });
});

router.get('/boards', requireLogin, function(req, res, next) {

    res.locals.user = req.user;

    LoginInfo.findOne({_id: req.user._id}).
        populate('boards').exec(function(err, user){
            res.render('boards', {
                boards: user.boards
            });
        });

});

router.get('/noaccess', function(req,res,next){
    var signin = "Sign In";
    if(req.user) {
        signin = "Sign Out";
    }

    res.render('permission', {
        title: 'Prello',
        cssFile: '/stylesheets/noaccess.css',
        navCSS: '/stylesheets/navbar.css',
        signIn: signin,
        user: undefined,
        bid: undefined,
        boards: undefined,
    });
});


module.exports = router;
