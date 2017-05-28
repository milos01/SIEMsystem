var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');

var User = require('../model/user');
var Application = require("../model/application");
var Event = require("../model/event");
var Comment = require("../model/comment");
var authenticationCtrl = require('../controllers/authentication');

var userRouter = express.Router();

userRouter
  
  //Get user by Id with owner_applications and assigned_applications
  .get('/user/:id', function(req, res, next) {
    User.findOne({"_id": req.params.id})
    .populate('owner_applications').populate('assigned_applications').exec(function(err, user) {
      if (err){
        return next(err);
      }
      res.json(user);
    });
  })
  //Get user by email
  .get('/usere/:email', function(req, res, next) {
    User.findOne({"email": req.params.email}).exec(function(err, user) {
      if (err){
        return next(err);
      }
      res.json(user);
    });
  })
  //Get all users with owner_applications and assigned_applications
  .get('/user', function(req, res) {
      User.find({}).populate('owner_applications').populate('assigned_applications').exec(function(err, data, next) {
        res.json(data);
      });
  })
  //Register user
  .post('/register', authenticationCtrl.register)
  //Logi user
  .post('/login', authenticationCtrl.login)
  .get('/login/facebook', passport.authenticate('facebook'))
  .get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
    res.json("done");
  });
  
module.exports = userRouter;