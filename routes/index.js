var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Prello', 
                        cssFile: 'stylesheets/style3.css',
                        script: 'javascripts/script3.js'
                      });
});


module.exports = router;
