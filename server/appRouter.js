var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
var User = require('../model/user');
var UserApp = require('../model/UserApp');
var User = require('../model/user');
var Application = require("../model/application");
var Event = require("../model/event");
var Comment = require("../model/comment");
var permit = require("../server/middleware/permission");
var AlarmRules = require("../model/alarmRules");
var Rule = require("../model/rule");

var user = new User();
//Check if token is valid

module.exports = function(app, express, csrf, auth){
  var appRouter = express.Router();

  appRouter

  .post('/test', csrf, auth, permit('admin'), function(req, res){
    
    
  })
 .get('/loggedUserr', auth, function(req, res){
   
    if (req.payload == null) {
      if(req.user){
        User
        .findById(req.user._id).populate('role')
        .exec(function(err, user) {
          res.status(200).json(user);
        });
      }else{
        res.status(401).json({
          "message" : "UnauthorizedError: private profile"
        });
      }
    } else {
      UserApp
        .findById(req.payload._id).populate('role')
        .exec(function(err, user) {
          res.status(200).json(user);
        });
    }
  })

 .post("/userpass", auth, function(req, res, done) { 
    var oldPass = req.body.oldPassword;
    var newPass = req.body.newPassword;
    if (req.payload) {
      UserApp.findById(req.payload._id).exec(function(err, user) {
        if(user.validPassword(oldPass)){
          user.setPassword(newPass);

          user.save(function(err) {
          if (err){
            return done(err);
          }
            return res.status(200).json(user);
          });
        }else{
          res.status(400).json("Not same old password!");
         
        }
        
      });
    }else{
      res.json("boo");
    } 
  })

 .post("/rule", csrf, auth, permit('admin'), function(req, res, done) { 
    r = new Rule();
    r.n = req.body.n;
    r.t = req.body.t;
    r.save(function(err){
      if (err) {
        return done(err);
      }
    });

    AlarmRules.find({"errType": req.body.type}).exec(function(err, rule, next) {
      if (!rule.length) {
        var ar = new AlarmRules();
        ar.errType = req.body.type;
        ar.rules.push(r);
        ar.save(function(err , rl){
          if (err) {
            return done(err);
          }
        });
      }else{
        rule[0].rules.push(r);
        rule[0].save(function(err , rl){
          if (err) {
            return done(err);
          }
        });
      }

    });
    
  })

  return appRouter;
}