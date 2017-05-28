(function(angular){
	
		app.factory('UserResource',function(Restangular){

		var retVal = {};

		
		///user/:uid
		retVal.getUserById =  function(uid){
			return Restangular.one('user',uid).get().then(function(response){
				return response;
			});
		}


		return retVal;
	})

})(angular);