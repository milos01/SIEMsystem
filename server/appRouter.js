var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');
var User = require('../model/user');
var Application = require("../model/application");
var Event = require("../model/event");
var Comment = require("../model/comment");
var jwt = require('express-jwt');

var appRouter = express.Router();
var isLoggedIn = function (req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
    }
    // if they aren't redirect them to the home page
    res.status(401).json({
        "message" : "UnauthorizedError: Unauthorized access"
    });
  }
appRouter
  //Get logged user
 .get('/loggedUser',isLoggedIn, function(req, res){
    if (!req.user) {
      res.status(401).json({
        "message" : "UnauthorizedError: private profile"
      });
    } else {
      res.status(200).json(req.user);
      // User
      //   .findById(req.payload._id)
      //   .exec(function(err, user) {
      //     res.status(200).json(user);
      //   });
    }
  })
  //Get users owner_applications
  .get('/user/:id/oapplication', function(req, res, next) {
    // User.findOne({"_id": req.params.id}).populate('owner_applications').exec(function(err, user) {
    //   if (err) {
    //     return next(err);
    //   }

    //   res.json(user.owner_applications);
    // });
  })
  //Get users assigned_applications
  .get('/user/:id/applications', function(req, res, next) {
    User.findOne({"_id": req.params.id}).populate('assigned_applications').exec(function(err, user) {
      if (err) {
        return next(err);
      }

      res.json(user.assigned_applications);
    });
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
  //Post to assigned_application collection 
  .post('/application/:aid/user/:id', function(req, res, next) {
      User.findOne({"_id": req.params.id}, function(err, user) {
        if (err) {
          return next(err);
        }
        Application.findOne({"_id": req.params.aid}, function(err, application){
          if(err){
            return next(err);
          }
          
            User.findByIdAndUpdate(user._id,{$push: {"assigned_applications": application._id}}, function(err, user1){
              if(err){
                return next(err);
              }
              Application.findByIdAndUpdate(application._id,{$push: {"users": user._id}}, function(err, app){
                if(err){
                  return next(err);
                }
                res.json(application);
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

module.exports = appRouter;