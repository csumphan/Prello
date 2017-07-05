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
router.get('/', requireLogin, function(req, res, next) {
  //res.locals.user = req.user;

  res.render('index', { title: 'Prello',
                        cssFile: 'stylesheets/style3.css',
                        script: 'javascripts/script3.js'
                      });
});


module.exports = router;
