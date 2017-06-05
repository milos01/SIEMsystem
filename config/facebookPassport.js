var facebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/user');
var conf = require('../conf.json');

module.exports = function(passport, mongoose){
  passport.use(new facebookStrategy({
    clientID: conf.clientID,
    clientSecret: conf.clientSecret,
    callbackURL: 'http://localhost:8080/api/login/facebook/return',
    includeEmail: true,
    profileFields: ['id', 'displayName' ,'emails']
  },
  function(accessToken, refreshToken, ouser, done) {
    User.findOne({ email: "milosa942@gmail.com" }, function (err, user) {
      if (err) { return done(err); }
        // Return if user not found in database
        if (!user) {
            var newUser = new User();

            newUser.name = ouser.displayName;
            
            newUser.email = "milosa942@gmail.com";

            newUser.password = "aaa";

            newUser.save(function(err) {
            if (err){
                 return done(err);
            }
            return done(null, newUser);
            });
        }else{
          // If credentials are correct, return the user object
          return done(null, user);
        }
      });
    }
  ));

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
}
