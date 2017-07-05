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
  res.locals.user = req.user;

  res.render('boards');
});


module.exports = router;
