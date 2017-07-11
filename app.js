//starting point of express
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

//var board = require('./routes/board');
//var loginPage = require('./routes/loginPage');
//var boards = require('./routes/boards');
var index = require('./routes/index');
var users = require('./routes/users');
var list = require('./routes/list');
var board = require('./routes/board');
var loginInfo = require('./routes/login');
var mongoose = require('mongoose');

var LoginInfo = require('./models/loginInfo');
var isin = require('./contains');

mongoose.connect('mongodb://localhost/prello'); //must speficy port if it is not default
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!

});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); middleware excute in order
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

app.use(session({
  cookieName: 'session',
  secret: 'iqJ4O7uApJuefOEq7pUq',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    LoginInfo.findOne({ username: req.session.user.username }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

app.use(function(req, res, next){
    var urlSplit = req.path.split('/');
    console.log(req.session.user);
    console.log(urlSplit);
    if(urlSplit.length === 3 && (['boardManager','board'].includes(urlSplit[1]))) {

        if(!req.session.user) {
            res.redirect('/noaccess');
        }
        else {
            var boardsList = req.session.user.boards;
            console.log(boardsList);
            if(!isin(boardsList,urlSplit[2])) {
                res.redirect('/noaccess');
            }
            else{
                next();
            }
        }
    }

    else {
    next();
}
});


app.use('/boardManager', board);
app.use('/', index);
app.use('/users', users);
app.use('/list', list);
//app.use('/boards', boards);

//route that handles getting/posting login info
//also validates login credentials
app.use('/create', loginInfo);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
