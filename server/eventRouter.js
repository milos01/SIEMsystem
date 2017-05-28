var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var User = require('../model/user');
var Application = require("../model/application");
var Event = require("../model/event");
var Comment = require("../model/comment");
var common = require('../events/eventsConf');
require('../events/eventListeners');

var commonEmitter = common.commonEmitter;


var eventRouter = express.Router();


eventRouter
  //Post new event
  .post('/application/:aid/event', function(req, res, next) {
    var event = new Event(req.body);

      Application.findOne({"_id": req.params.aid}, function(err, application) {
        if (err) {
          return next(err);
        }
        
        var dns = req.body.dns;
        if (dns==application.dns){
          if(!isNaN(parseFloat(event.app_version))){
            if(parseFloat(application.version) < parseFloat(event.app_version)){
              application.version = event.app_version;
            } 
          }
            application.events.push(event);
            application.save(function(err, savedEvent){
              if (err) {
                return next(err);
              }
              commonEmitter.emit('sendMail', event, application.app_name);
              res.json(savedEvent);
            });
        }
        else{
          var ob = {"fild":true};
          res.json(ob);
        }

    });
  })
  //Get event
  .get('/application/:aid/event/:eventId', function(req, res, next) {
      Application.findOne({"_id": req.params.aid}, function(err, application) {
        if (err) {
          return next(err);
        }
        var event = application.events.filter(function (event) {
          return String(event._id) === req.params.eventId;
        }).pop();
        res.json(event);
    });
  })
  //Get applicaiton events
  .get('/application/:aid/event', function(req, res, next) {
      Application.findOne({"_id": req.params.aid}, function(err, application) {
        if (err) {
          return next(err);
        }
        res.json(application.events);
    });
  })
  //Get application events with the same fragment
  .get('/application/:aid/event/:eventId/fragment', function(req, res, next) {
      Application.findOne({"_id": req.params.aid}, function(err, application) {
        if (err) {
          return next(err);
        }
        var event = application.events.filter(function (event) {
          return String(event._id) === req.params.eventId;
        }).pop();
        var events = [];
        application.events.filter(function (ev) {
          if(event.fragment === ev.fragment && String(event._id) !== String(ev._id)){
            events.push(ev);
          }
        });
        res.json(events);
    });
  })
  //Delete event form collection
  .delete('/application/:aid/event/:eid', function(req, res, next) {
    console.log(typeof application._id);
    console.log(typeof targetUserId);
    Application.update( 
        { _id: req.params.aid },
        { $pull: { events : { _id : req.params.eid } } },
        { safe: true },
        function removeConnectionsCB(err, obj) {
            res.json(obj);
        });
  });

module.exports = eventRouter;