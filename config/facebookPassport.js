var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var conf = require('../conf.json');

passport.use(new facebookStrategy({
    clientID: conf.clientID,
    clientSecret: conf.clientSecret,
    callbackURL: 'http://localhost:8080/api/login/facebook/return'
  },
  function(accessToken, refreshToken, user, done) {
    // User.findOne({ email: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   // Return if user not found in database
    //   if (!user) {
    //     return done(null, false, {
    //       message: 'User not found'
    //     });
    //   }
    //   // Return if password is wrong
    //   if (!user.validPassword(password)) {
    //     return done(null, false, {
    //       message: 'Password is wrong'
    //     });
    //   }
    //   // If credentials are correct, return the user object
    //   return done(null, user);
    // });
    return done(null, user);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});