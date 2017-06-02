var passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var conf = require('../conf.json');


passport.use(new GoogleStrategy({
    clientID:     "639218561620-iuu683pvjf2qvdq00jm5rrv1sb26c6b2.apps.googleusercontent.com",
    clientSecret: "9xl2OqzXi5xfPLE51h9SmDMj",
    callbackURL: "http://localhost:8080/api/login/google/return",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});