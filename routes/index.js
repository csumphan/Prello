var express = require('express');
var router = express.Router();

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

router.get('/board', requireLogin, function(req, res, next) {
  //res.locals.user = req.user;

  res.render('index', { title: 'Prello',
                        cssFile: 'stylesheets/style3.css',
                        script: 'javascripts/script3.js'
                      });
});

router.get('/boards', function(req, res, next) {
    console.log(req.user);
  res.locals.user = req.user;

  res.render('boards');
});


module.exports = router;
