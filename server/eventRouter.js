var Comment = require("../model/comment");
var Event = require("../model/event");
var TimeSchedule = require("../model/timeSchedule");
var AlarmRules = require("../model/alarmRules");
var Alarm = require("../model/alarm");
var fs = require('fs');
var nodersa = require('node-rsa');
var sha256 = require('js-sha256').sha256;
var crypto = require('crypto');
//var common = require('../eventsConf');
//require('../events/eventListeners');

//var commonEmitter = common.commonEmitter;

module.exports = function(app, express, crypto, auth, RuleEngine){

  var eventRouter = express.Router();

  var replayAttackMap = {};

  function addValueToKey(key, value) {
    replayAttackMap[key] = replayAttackMap[key] || [];
    replayAttackMap[key].push(value);
  }

  function isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

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

    var messageToHash = req.body.Date+req.body.Type+req.body.Message+req.body.System+req.body.LogNumber;

    // `signmsg` displayed by the above C# program
    //var sig = 'dXLiJdc23Uc1tU/PPQmoFHh6ci6XTX/IvukdBHfsoEAOmgOioNrhXD33XPn00CCado78MnNJuKuDqrCN2l7EY+BMJEWWnpE5WnTMFKyhRs3aNHT4qrNwCJ+o07VhF0jS6Jv/ccjfjcwp1c0QKQ7bNjuEVjXg7vsyfbFJ3Fxt54PK3Gc2RuOH/Ur7Ebz9TN5hTiDj4j6gw3MlqNZc1u8bCaH93Xkm06JRMzdHNxoINGZuAy72SQnhRxmUGITKLHB3J7kz5vhI6f8pk9D8LNn9A99aLTyIi0FONbvtQlHmiM6+H4628uge6cQIlkKYPc6GYLPr+nEMOHvkRhHOlHJDIg=='
    var sig = req.body.Signature;
    var pubKey;
    var agentName = req.body.ComputerName;
    var logNumber = req.body.LogNumber;
    fs.readFile('./WindowsAgent/publicKey.pem','utf8', function (err,pubKey) {
      if (err) {
        return console.log(err);
      }
      //console.log(pubKey);
      var verify = crypto.createVerify('RSA-SHA256');
      verify.update(messageToHash);
      if(verify.verify(pubKey, new Buffer(sig, 'base64'))){

        if(replayAttackMap[agentName] === undefined){
          replayAttackMap[agentName] = [];
        }
        var exists = false;
        if(replayAttackMap[agentName].indexOf(logNumber) > -1){
          exists = true;
          return res.json(200);
        }
        else{
          replayAttackMap[agentName].push(logNumber);
        }
        if(logNumber === "8000"){
          replayAttackMap[agentName] = [];
        }
        console.log(replayAttackMap);
        var partOfDate;
        var timePart;
        var date;
        if(req.body.System == "Windows"){
        /*
        partOfDate = req.body.Date.split(" ");
        var datePart = partOfDate[0].split("/");
        timePart = partOfDate[1].split(":");
        var hours = parseInt(timePart[0]);
        if(partOfDate[2] == "PM"){
          hours += 12;
        }
        date = new Date(parseInt(datePart[2]),parseInt(datePart[0]), parseInt(datePart[1]), hours, parseInt(timePart[1]), parseInt(timePart[2]), 0);
        */
          date = new Date(req.body.Date);
        }
        else{
          partOfDate = req.body.Date.split(" ");
          timePart = partOfDate[2].split(":");
          date = new Date(2017,convertMonthNameToNumber(partOfDate[0]),parseInt(partOfDate[1]),parseInt(timePart[0]),parseInt(timePart[1]),parseInt(timePart[2]),0);
        }
    
    var event = new Event();
    event.type = req.body.Type;
    event.system = req.body.System;
    event.computerName = req.body.ComputerName;
    event.message = req.body.Message;
    event.signature = req.body.Signature;
    event.createdAt = date;
    /*
    Event.find({'type': req.body.Type, 'computerName': req.body.ComputerName}).limit(1).sort( { createdAt: -1 } ).exec(function(err, eve, next) {
      // if (eve.length) {
        TimeSchedule.find({'errType': req.body.Type, 'logID': req.body.ComputerName}, function(err, ts){
          // console.log(ts);
          if(!ts.length){
            // console.log('mhhmm' + date);
            var nts = TimeSchedule();
            nts.logID = req.body.ComputerName;
            nts.n = 1;
            nts.t = 0;
            nts.errType = req.body.Type;
            nts.eventTimes.push(date);


            nts.save(function(err, savedTs){
              if (err) {
               return next(err);
             }
              // res.status(200).json(savedTs);
            });
          }

          
          if(ts.length > 0){
            var currN = ts[0].n + 1;
            ts[0].n += 1;
            if(!ts[0].eventTimes.length){
              ts[0].eventTimes.push(date);
            }
            if(currN > 1){
              var newEventDate = date;
              var dbEventDate = eve[0].createdAt;
              var diff = newEventDate.getTime() - dbEventDate.getTime();
              ts[0].t += diff;
              ts[0].eventTimes.push(date);

            }
            ts[0].save(function(err, savedTss){
              if (err) {
                return next(err);
              }
              ruleEngine(savedTss);
            });
          }
        });
      // }
    });
    */

    event.save(function(err, savedEvent){
      res.status(200).json(savedEvent);
    });    
      }
      else{
        var partOfDate;
        var timePart;
        var date;
   
        partOfDate = req.body.Date.split(" ");
        timePart = partOfDate[2].split(":");
        date = new Date(2017,1,1,1,1,1,0);
    
    

        var event = new Event();
        event.type = hash2;
        event.system = decrypted;
        event.computerName = encrypted;
        event.message = messageToHash;
        event.signature = req.body.Signature;
        event.createdAt = date;
        // Event.find({"d":2}).limit(1).sort( { createdAt: -1 } ).exec(function(err, events, next) {
        //     res.status(200).json(events);
        // });
    
    

        event.save(function(err, savedEvent){
          res.status(200).json(savedEvent);
        });
      }
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

  //Get all alarms
  .get('/alarm', auth,function(req, res, next) {
    Alarm.find({}, function(err, alarms) {
      if (err) {
        return next(err);
      }

      res.json(alarms);
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
  })

  function ruleEngine(fact){

    var ar = new AlarmRules();
    ar.save(function(){
      
    })
    var rules = [{
      "condition": function(R) {
        R.when(this && (this.n >= 3) && (this.t <= 60000));
      },
      "consequence": function(R) {
            this.result = false;
            R.stop();
          }
        }];

    //initialize the rule engine 
    var R = new RuleEngine(rules);


    while(fact.t > 60000 && fact.n > 1){

      fact.n -= 1;
      fact.eventTimes.splice(0, 1);
      var newT = 0;
      for (var i = fact.eventTimes.length - 1; i >= 0; i--) {
        if(i != 0){
          newT += (fact.eventTimes[i].getTime() - fact.eventTimes[i-1].getTime())
          console.log(fact.eventTimes[i] + " " + fact.eventTimes[i-1]);
        }
      }
      fact.t = newT;
      R.execute(fact,function(result){ 
        // console.log(result.result);
        if(result.result){ 
          notFiredRepeatAlarm(result);
        }else{ 
          firedAlarm(result);
        }
      });
    }

    
    R.execute(fact,function(result){ 
      if(result.result){ 
        console.log("Do not fire alarm"); 
      }else{ 
        firedAlarm(result);
      }
    });
  };

  function firedAlarm(result){
    console.log("Fire alarm");

    TimeSchedule.findById(result._id, function (err, ts) {
      ts.t = 0;
      ts.n = 0;
      ts.eventTimes = [];
      ts.save(function(err, savedTs){
        if(err){
          return next(err);
        }
        var alarm = new Alarm();
        alarm.computerName = savedTs.logID;
        alarm.type = savedTs.errType;
        alarm.createdAt = new Date();
        alarm.save(function(err, saveAlarm){
          if (err) {
            return next(err);
          }
        });
      })
    });
  };

  function notFiredRepeatAlarm(result){
    console.log("Do not fire alarm");
    TimeSchedule.findById(result._id, function (err, ts) {
      ts.t = 0;
      ts.n -= 2;
      ts.eventTimes = result.eventTimes.splice(0, 1);;
      ts.save(function(err){
        if(err){
          return next(err);
        }
      })
    });
  };
  return eventRouter;
}
