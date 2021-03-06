var express = require('express');
var app = express();
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var passport = require('passport');
var jwt = require('express-jwt');
var crypto = require('crypto');
var RuleEngine = require('node-rules');


var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

mongoose.connect('mongodb://localhost/siemcenter');

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var homerouter = require('./server/homeRouter')(app, express);
var userrouter = require('./server/userRouter')(app, express,passport, auth);
var approuter = require('./server/appRouter')(app, express, csrfProtection, auth);
var eventrouter = require('./server/eventRouter')(app, express,crypto, auth, RuleEngine);

var alarmRouter = require('./server/alarmRouter')(app, express);
require('./config/facebookPassport')(passport, mongoose);
require('./config/localPassport')(passport, mongoose);
// require('./config/googlePassport');

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
app.use('/api', alarmRouter);

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
