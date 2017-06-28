(function () {
	app.controller('applicaitonCtrl', function($scope, meanData, ApplicationResource, EventResource, $uibModal, $log, toastr, filters){
		var vm = this;

		EventResource.getAllEvents().then(function(items){
			vm.events = items;
		});

		vm.checkSystem = function(system) {
	        filters.checkSystem(system);
	    }

	    vm.checkPc = function(pc) {
	         filter.checkPc(pc);
	    }
    
	    vm.systemFilter = function(event) {
	        return filters.systemFilter(event);
	    }

	    vm.pcFilter = function(event) {
	        return filters.pcFilter(event);
	    }
		
		vm.openReportModal = function() {
        	toastr.error('Log message', 'Log name');
        };

        vm.deleteApp = function(aid){
        	ApplicationResource.deleteApp(aid).then(function(item){
        		$scope.applications.splice($scope.applications.indexOf(item), 1);
        	});
        };

	});

	app.controller('testCtrl', function($scope, ApplicationResource, sweet){
		$scope.checkNewUser = function(app){
			if($scope.newuser.app_name){
	        	ApplicationResource.getUserByEmail($scope.newuser.app_name).then(function(user){

	        		if(user){
	        			$scope.newUserForm.newuser.$setValidity("acceptUser", true);
	        			if(app.owner[0] != user._id){
			        		ApplicationResource.getAppUsers(app._id).then(function(items){
			        			angular.forEach(items, function(value, key) {
								  	if(value === user._id){
								  		$scope.newUserForm.newuser.$setValidity("acceptUser", false);
								  	}
								});
			        		});
		        		}else{
	        				$scope.newUserForm.newuser.$setValidity("acceptUser", false);
	        			}
	        		}else{

	        			$scope.newUserForm.newuser.$setValidity("acceptUser", false);
	        		}
	        		
	        	});
        	}
		}

		$scope.addNewUser = function(aid, app){
        	ApplicationResource.getUserByEmail($scope.newuser.app_name).then(function(user){
        		ApplicationResource.postNewUserOnCompany(aid, user._id).then(function(item){
        			app.users.length += 1;
        			$scope.newuser.app_name = "";
        			sweet.show(user.first_name + " " + user.last_name + " assigned to application.");
        		});
        	});
        }
	});

	app.controller('ReportModalCtrl', function($scope, $uibModalInstance, $log, ApplicationResource, meanData) {
		var vm = this;
    	vm.addNewApp = function() {
    		meanData.getLoggedUser().then(function(user) {
		   	 	ApplicationResource.postNewApp(user.data._id, vm).then(function(item){
		   	 		$scope.applications.push(item);
    			});
		   	});
    		
			$uibModalInstance.close('ok');
		};

		vm.cancel = function() {
			console.log("cancel");
			$uibModalInstance.dismiss('cancel');
		};
	});
})();