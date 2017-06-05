var express = require('express');
var app = express();
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var morgan      = require('morgan');
var passport = require('passport');

mongoose.connect('mongodb://localhost/siemcenter');

var homerouter = require('./server/homeRouter')(app, express);
var userrouter = require('./server/userRouter')(app, express,passport);
var approuter = require('./server/appRouter')(app, express);
var eventrouter = require('./server/eventRouter')(app, express);
var commentrouter = require('./server/commentRouter')(app, express);
require('./config/facebookPassport')(passport, mongoose);
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
