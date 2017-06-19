(function () {
	app.controller('applicaitonCtrl', function($scope, meanData, ApplicationResource, EventResource, $uibModal, $log, toastr){
		var vm = this;

		EventResource.getAllEvents().then(function(items){
			vm.events = items;
		});

		vm.systemIncludes = [];
		vm.pcIncludes = [];
    
	    vm.checkSystem = function(system) {
	        var i = $.inArray(system, vm.systemIncludes);
	        if (i > -1) {
	            vm.systemIncludes.splice(i, 1);
	        } else {
	            vm.systemIncludes.push(system);
	        }
	    }

	    vm.checkPc = function(pc) {
	        var i = $.inArray(pc, vm.pcIncludes);
	        if (i > -1) {

	            vm.pcIncludes.splice(i, 1);
	        } else {
	        	vm.pcIncludes = [];
	            vm.pcIncludes.push(pc);
	        }
	        // console.log(vm.pcIncludes);
	    }
    
	    vm.systemFilter = function(event) {
	        if (vm.systemIncludes.length > 0) {
	            if ($.inArray(event.event_type, vm.systemIncludes) < 0)
	                return;
	        }
	        
	        return event;
	    }

	    vm.pcFilter = function(event) {
	        if (vm.pcIncludes.length > 0) {
	        	if($.inArray('', vm.pcIncludes) >= 0){
	        		return event;
	        	}
	            if ($.inArray(event.data, vm.pcIncludes) < 0){
	                return;
	            }
	        }
	        
	        return event;
	    }
		
		vm.openReportModal = function() {
        	toastr.error('Log message', 'Log name');
        };

        vm.deleteApp = function(aid){
        	ApplicationResource.deleteApp(aid).then(function(item){
        		$scope.applications.splice($scope.applications.indexOf(item), 1);
        	});
        }

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