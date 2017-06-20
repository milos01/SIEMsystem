(function(angular){

	app.factory('ReportResource',function(Restangular){

		var retVal = {};

		
		
		//'/timeFrom/:timeFrom/timeTo:/timeTo'
		retVal.getLogs =  function(timeFrom,timeTo){
			return Restangular.one('timeFrom',timeFrom).one('timeTo',timeTo).get().then(function(response){
				return response;
			});
		}
		///atimeFrom/:timeFrom/atimeTo/:timeTo
		retVal.getAlarms =  function(timeFrom,timeTo){
			return Restangular.one('atimeFrom',timeFrom).one('atimeTo',timeTo).get().then(function(response){
				return response;
			});
		}
		return retVal;
	})

})(angular);