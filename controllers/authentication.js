var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../model/UserApp');
var Role = require('../model/role');

module.exports.register = function(req, res) {
  Role.findOne({role_name: 'admin'}, function(err, role){
    var user = new User();
    user.name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;

    user.setPassword(req.body.password);
    user.role.push(role);
    user.save(function(err) {
      if(err){
         return res.json({
            "err" : err
          });
      }
      var token;
      token = user.generateJwt();
      res.status(200).json({
        "token" : token
      });
    });
  });
};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};