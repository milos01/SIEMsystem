(function(angular){
	
		app.factory('EventResource',function(Restangular){

		var retVal = {};

		
		//application/:aid/event
		retVal.getEventsByIdApp =  function(ida){
			return Restangular.one('application',ida).all('event').getList().then(function(response){
				return response;
			});
		}

		retVal.saveNewEvent = function(obj,ap){
			var ev = {
				"data":obj.data,
				"stack":obj.stack,
				"event_type":obj.event_type,
				"fragment":obj.fragment,
				"app_version": ap.version,
				"dns": obj.dns
			}
			return Restangular.one('application',ap._id).all('event').post(ev).then(function(res){
				return res;
			});
		}

		//application/:aid/event/:eid
		retVal.getEvent =  function(ida, ide){
			return Restangular.one('application',ida).one('event', ide).get().then(function(response){
				return response;
			});
		}



		return retVal;
	})

})(angular);