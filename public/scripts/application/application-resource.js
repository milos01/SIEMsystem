(function(){
	
	app.factory('ApplicationResource',function(Restangular){
		
		var retVal = {};
		
		retVal.getAllApps = function(uid){
			return Restangular.one('user', uid).all('oapplication').getList().then(function(items){
				return items;
			});
		}

		retVal.getAppById = function(ida){
			
			return Restangular.one('application', ida).get().then(function(response){
				return response;
			});
		}

		retVal.getAllAssApps = function(uid){
			return Restangular.one('user', uid).all('applications').getList().then(function(items){
				return items;
			});
		}

		retVal.postNewApp = function(uid, app){
			return Restangular.one('user', uid).all('application').post(app).then(function(item){
				return item;
			});
		}

		retVal.deleteApp = function(aid){
			return Restangular.one('application', aid).remove().then(function(item){
				return item;
			});
		}

		retVal.getAppUsers = function(aid){
			return Restangular.one('application', aid).all('users').getList().then(function(items){
				return items;
			});
		}

		retVal.getUserByEmail = function(email){
			return Restangular.one('usere', email).get().then(function(item){
				return item;
			});
		}

		retVal.postNewUserOnCompany = function(aid, uid){
			return Restangular.one('application', aid).one('user', uid).post().then(function(item){
				return item;
			});
		}

		return retVal;
	})
	
})();