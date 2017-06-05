(function () {
	app.controller('applicaitonCtrl', function($scope, meanData, ApplicationResource, $uibModal, $log){
		var vm = this;

		// meanData.getLoggedUser().then(function(user) {
		//    	 ApplicationResource.getAllApps(user.data._id).then(function(items){
		//    	 		$scope.applications = items;
		//    	 });
		//    	 ApplicationResource.getAllAssApps(user.data._id).then(function(items){
		//    	 		$scope.assigned_applications = items;
		//    	 });
		// }, function (e) {
		//       console.log(e);
		// });

		vm.openReportModal = function() {
        	var modalInstance = $uibModal.open({
        	   templateUrl: '/views/modals/newAppModal.html',
        	   controller: 'ReportModalCtrl as vm',
        	   scope: $scope
        	});
        
        	modalInstance.result.then(function(value) {
        	    $log.info('Modal finished its job at: ' + new Date() + ' with value: ' + value);
        		}, function(value) {
        	    $log.info('Modal dismissed at: ' + new Date() + ' with value: ' + value);
        	    });
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