var express = require('express');
var app = express();
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var passport = require('passport');

mongoose.connect('mongodb://localhost/eventlogger');

var homerouter = require('./server/homeRouter');
var userrouter = require('./server/userRouter');
var approuter = require('./server/appRouter');
var eventrouter = require('./server/eventRouter');
var commentrouter = require('./server/commentRouter');
require('./config/facebookPassport');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'))
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 8080; 


app.use('/', homerouter);
app.use('/api', approuter);
app.use('/api', userrouter);
app.use('/api', eventrouter);
app.use('/api', commentrouter);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.status(status).json({
    message: message,
    error: error
  });
});

app.listen(port);

console.log('Server running on port: ' + port);
