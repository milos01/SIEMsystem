var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
var User = require('../model/user');
var UserApp = require('../model/UserApp');
var Application = require("../model/application");
var Event = require("../model/event");
var Comment = require("../model/comment");
var jwt = require('express-jwt');

//Check if token is valid
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

module.exports = function(app, express){
  var appRouter = express.Router();

  appRouter
  //Get logged user
 .get('/loggedUserr', auth, function(req, res){
    if (!req.payload._id) {
      res.status(401).json({
        "message" : "UnauthorizedError: private profile"
      });
    } else {
      UserApp
        .findById(req.payload._id)
        .exec(function(err, user) {
          res.status(200).json(user);
        });
    }
  })
  //Post new application for user
  .post('/user/:id/application', function(req, res, next) {
    var application = new Application(req.body);
    User.findOne({"_id": req.params.id}, function(err, user) {
      if (err) {
        return next(err);
      }
      application.save(function(err, savedApp){
        if(err){
          return next(err);
        }
        User.findByIdAndUpdate(user._id, {$push:{"owner_applications": savedApp._id}}, function (err, user1) {
        if(err){
          return next(err);
        }
        Application.findByIdAndUpdate(savedApp._id, {$push:{"owner":user._id}}, function (err, user2) {
          if(err){
            return next(err);
          }
          res.json(savedApp);
        });
        });
      }); 
    });
  })

  //Get application by id
  .get('/application/:id', function(req, res, next) {
    if (!req.payload._id) {
      res.status(401).json({
        "message" : "UnauthorizedError: private profile"
      });
    } else {
      Application.findOne({"_id": req.params.id}).populate('users').populate('owner').exec(function(err, application) {
        if (err) {
          return next(err);
        }
        res.json(application);
        });
    }
  })

  //Get all assigned users for some applicatiom 
  .get('/application/:aid/users', function(req, res, next) {
      Application.findOne({"_id": req.params.aid}, function(err, application) {
        if (err) {
          return next(err);
        }
        res.json(application.users);
    });
  })
  //Delete application
  .delete('/application/:id', function (req, res, next) {

    Application.findOne({"_id": req.params.id}).exec(function(err, application) {
      if (err) {
          return next(err);
      }
      var app = application;

      Application.findOneAndRemove({"_id":req.params.id},function (err, appl) {
        if(err){
          return next(err);
        }
        appl.remove();
        // console.log(appl);
      });
      res.json(app);
    });
  });

  return appRouter;
}