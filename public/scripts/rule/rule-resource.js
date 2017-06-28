(function(angular){
	
		app.factory('RuleResource',function(Restangular){

		var retVal = {};

		//api/event
		retVal.newRule =  function(rule){
			return Restangular.all('rule').post(rule).then(function(res){
				return res;
			});		
		}

		return retVal;
	})

})(angular);