var Comment = require("../model/comment");
var Event = require("../model/event");
//var common = require('../eventsConf');
//require('../events/eventListeners');

//var commonEmitter = common.commonEmitter;

module.exports = function(app, express){
  var eventRouter = express.Router();

  eventRouter
  //Post new event
  .post('/event', function(req, res, next) {
    var event = new Event(req.body);
    // Event.find({}).limit(1).sort( { createdAt: -1 } ).exec(function(err, events, next) {
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
