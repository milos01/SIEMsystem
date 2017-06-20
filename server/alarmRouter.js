var Alarm = require("../model/alarm");

module.exports = function(app, express){
  var alarmRouter = express.Router();


  	alarmRouter.post('/alarm',function(req, res, next){
  		var alarm = new Alarm(req.body);

  		alarm.save(function(err, savedAlarm){
      		res.status(200).json(savedAlarm);
    	});  
  	});
  	

	alarmRouter.get('/atimeFrom/:timeFrom/atimeTo/:timeTo',function(req,res,next){
	      var dateFrom = new Date(req.params.timeFrom);
	      var dateTo = new Date(req.params.timeTo);
	      
	      var linuxNumb = 0;
	      var winNumb = 0;
	      var machines = [];


	      Alarm.count({"system":"Linux","createdAt":{$gte:dateFrom,$lt:dateTo}},function(err,ev){
	        linuxNumb = ev;
	        Alarm.count({"system":"Windows","createdAt":{$gte:dateFrom,$lt:dateTo}},function(err,ev1){
	          winNumb = ev1;
	          Alarm.aggregate(

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

	return alarmRouter;
 }