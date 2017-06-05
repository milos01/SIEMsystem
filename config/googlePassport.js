var passport = require('passport');
var GitHubStrategy = require( 'passport-github2' ).Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var conf = require('../conf.json');


passport.use(new GitHubStrategy({
    clientID:     'Iv1.0469b50214f699a9',
    clientSecret: '494a922001de8e2285307db960988ade52ea8c05',
    callbackURL: 'http://127.0.0.1:8080/api/login/google/return',
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