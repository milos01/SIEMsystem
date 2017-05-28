var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var User = require('../model/user');
var Application = require("../model/application");
var Event = require("../model/event");
var Comment = require("../model/comment");

var commentRouter = express.Router(); 

commentRouter
  //Post new comment
  .post('/event/:eid/comment', function(req, res, next) {
      var comment = new Comment(req.body);
      
      
      Application.findOne({"events._id": req.params.eid}, function (err, ev) {
        if (err) {
          return next(err);
        }
        var event = ev.events.filter(function (event) {
          return String(event._id) === req.params.eid;
        }).pop();
        // res.json(event.comments);
        event.comments.push(comment);
        // res.json(event.comments);
        ev.save(function(err, savedEvent) {
          if (err) {
            return next(err);
          }
          var updatedEvent = savedEvent.events.filter(function (event) {
            return String(event._id) === req.params.eid;
          }).pop();
          res.json(updatedEvent);
        });
    });
  })
  //Get event comments
  .get('/event/:eid/comment', function(req, res, next) {
      var comment = new Comment(req.body);
      
      
      Application.findOne({"events._id": req.params.eid}, function (err, ev) {
        if (err) {
          return next(err);
        }
       
        var event = ev.events.filter(function (event) {
          return String(event._id) === req.params.eid;
        }).pop();
        res.json(event.comments);
    });
  })
   //Post new subcomment
  .post('/event/:eid/comment/:cid/subcomment', function(req, res, next) {
      var comment = new Comment(req.body);
      
      
      Application.findOne({"events._id": req.params.eid}, function (err, ev) {
        if (err) {
          return next(err);
        }
        var event = ev.events.filter(function (event) {
          return String(event._id) === req.params.eid;
        }).pop();

        var comment1 = event.comments.filter(function (com) {
          return String(com._id) === req.params.cid;
        }).pop();
        // res.json(comment1);
        comment1.comments.push(comment);
        // res.json(event.comments);
        ev.save(function(err, savedEvent) {
          if (err) {
            return next(err);
          }
          var updatedEvent = savedEvent.events.filter(function (event) {
            return String(event._id) === req.params.eid;
          }).pop();
          res.json(updatedEvent);
        });
    });
  })

module.exports = commentRouter;