var Comment = require("../model/comment");
var Event = require("../model/event");
var fs = require('fs');
var pickle = require('pickle');
var nodersa = require('node-rsa');
var sha256 = require('js-sha256').sha256;
//var common = require('../eventsConf');
//require('../events/eventListeners');

//var commonEmitter = common.commonEmitter;

module.exports = function(app, express, crypto){
  var eventRouter = express.Router();

  // Convert a hex string to a byte array
  function hexToBytes(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
  }

  function convertMonthNameToNumber(monthName) {
    var myDate = new Date(monthName + " 1, 2000");
    var monthDigit = myDate.getMonth();
    return isNaN(monthDigit) ? 0 : (monthDigit);
  }
  eventRouter
  //Post new event
  .post('/event', function(req, res, next) {

    var partOfDate = req.body.Date.split(" ");
    var timePart = partOfDate[2].split(":");
    var date = new Date(2017,convertMonthNameToNumber(partOfDate[0]),parseInt(partOfDate[1]),parseInt(timePart[0]),parseInt(timePart[1]),parseInt(timePart[2]),0);

    var event = new Event();
    event.type = req.body.Type;
    event.system = req.body.System;
    event.computerName = req.body.ComputerName;
    event.message = req.body.Message;
    event.signature = req.body.Signature;
    event.createdAt = date;
    // Event.find({"d":2}).limit(1).sort( { createdAt: -1 } ).exec(function(err, events, next) {
    //     res.status(200).json(events);
    // });
    
    

    event.save(function(err, savedEvent){
      res.status(200).json(savedEvent);
    });    
   
  })

  //Get all events
  .get('/event', function(req, res, next) {
      Event.find({}, function(err, events) {
        if (err) {
          return next(err);
        }
        
        res.json(events);
    });
  })

  
  .get('/timeFrom/:timeFrom/timeTo/:timeTo',function(req,res,next){
      var dateFrom = new Date(req.params.timeFrom);
      var dateTo = new Date(req.params.timeTo);
      
      var linuxNumb = 0;
      var winNumb = 0;
      var machines = [];


      Event.count({"system":"Linux","createdAt":{$gte:dateFrom,$lt:dateTo}},function(err,ev){
        linuxNumb = ev;
        Event.count({"system":"Windows","createdAt":{$gte:dateFrom,$lt:dateTo}},function(err,ev1){
          winNumb = ev1;
          Event.aggregate(

              {
                $match : {"createdAt":{$gte:dateFrom,$lt:dateTo}}
              },
              {
                $group : {_id : "$computerName", total : { $sum : 1 }}
              },function(err,ev2){
                console.log(ev2);
                machines = ev2;
                var jsonSend = {"linux":linuxNumb,
                                "windows":winNumb,
                                "machines":machines
                                };
                res.json(jsonSend);
              }
            );
        });
      });




      // Event.count({"system":"Linux","createdAt":{$gte:dateFrom,$lt:dateTo}},function(err,ev){
      //   linuxNumb = ev;
      // });

      // Event.count({"system":"Windows","createdAt":{$gte:dateFrom,$lt:dateTo}},function(err,ev){
      //   winNumb = ev;
      // });

      // Event.aggregate(

      //   {
      //     $match : {"createdAt":{$gte:dateFrom,$lt:dateTo}}
      //   },
      //   {
      //     $group : {_id : "$computerName", total : { $sum : 1 }}
      //   },function(err,ev){
      //     console.log(ev);
      //     machines = ev;
      //   }
      // );

      // var jsonSend = {"linux":linuxNumb,
      //                 "Windows":winNumb,
      //                 "machines":machines
      //                 };
      // res.json(jsonSend);
  })
  //Get applicaiton events
  .get('/application/:aid/event', function(req, res, next) {
    //   Application.findOne({"_id": req.params.aid}, function(err, application) {
    //     if (err) {
    //       return next(err);
    //     }
    //     res.json(application.events);
    // });
  })
  //Get application events with the same fragment
  .get('/application/:aid/event/:eventId/fragment', function(req, res, next) {
    //   Application.findOne({"_id": req.params.aid}, function(err, application) {
    //     if (err) {
    //       return next(err);
    //     }
    //     var event = application.events.filter(function (event) {
    //       return String(event._id) === req.params.eventId;
    //     }).pop();
    //     var events = [];
    //     application.events.filter(function (ev) {
    //       if(event.fragment === ev.fragment && String(event._id) !== String(ev._id)){
    //         events.push(ev);
    //       }
    //     });
    //     res.json(events);
    // });
  })
  //Delete event form collection
  .delete('/application/:aid/event/:eid', function(req, res, next) {
  //   console.log(typeof application._id);
  //   console.log(typeof targetUserId);
  //   Application.update( 
  //       { _id: req.params.aid },
  //       { $pull: { events : { _id : req.params.eid } } },
  //       { safe: true },
  //       function removeConnectionsCB(err, obj) {
  //           res.json(obj);
  //       });
  });

  return eventRouter;
}
