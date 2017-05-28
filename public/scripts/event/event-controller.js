(function(angular){


	app.controller('eventlCtrl',function(EventResource,$stateParams,ApplicationResource,$uibModal,filterFilter,$scope){

		var vm = this;

		var ida = $stateParams.appId;
		
		// vm.fragmentNames = [];

		EventResource.getEventsByIdApp(ida).then(function(res){
			
			$scope.eventList = res;
	
		});

		ApplicationResource.getAppById(ida).then(function(res){
			vm.application = res;
		});
		vm.filterEvents = "All";

		vm.appVersions = "All";

		// vm.filterNames = "All";

		vm.getCount = function(f){
			return filterFilter($scope.eventList, {fragment:f}).length;
		}

		vm.getVersionList = function(version){
			vm.appVersions = version;
			
		}

		vm.openListUserModal = function(ida) {
			
        	var modalInstance = $uibModal.open({
        	   // parent:'home',
        	   templateUrl: '/views/modals/userListModal.html',
        	   controller: 'UserListModalCtrl as vm',  
        	   resolve: {
        	      ida: function() {
        	      return ida;
        	      }
        	   }
        	});
        };

        vm.openEventModal = function(appl) {
        	var modalInstance = $uibModal.open({
        	   // parent: 'applicationProf',
        	   templateUrl: '/views/modals/newEventModal.html',
        	   controller: 'eventModalCtrl as vm',
        	   scope: $scope, 
        	   resolve: {
        	      appl: function() {
        	      return appl;
        	      }
        	   }
        	});
        };
	});
	
    app.controller('UserListModalCtrl',['ida','$uibModalInstance','ApplicationResource',function(ida,$uibModalInstance,ApplicationResource) {
		var vm = this;
		
		ApplicationResource.getAppById(ida).then(function(res){
			vm.application = res;
			vm.listUsers = vm.application.users;

		});

		vm.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	}]);

    app.controller('eventModalCtrl',['appl','$uibModalInstance','EventResource','$scope',function(appl,$uibModalInstance,EventResource,$scope) {
		var vm = this;
		
		vm.ap = appl;
		vm.dnsError = false;
		vm.yes = function(){
			
			EventResource.saveNewEvent(vm,vm.ap).then(function(res){
				
				if (res.fild==true){
					vm.dnsError = true;
				}
				else{
					$scope.eventList.push(res.events[res.events.length-1]);
					$uibModalInstance.dismiss('cancel');
				}
			});
			// $uibModalInstance.dismiss('cancel');
		}

		vm.cancel = function() {
			
			$uibModalInstance.dismiss('cancel');
		};
	}]);

	app.controller('eventInfoCtrl',function(EventResource,$stateParams,ApplicationResource,CommentResource,UserResource, meanData){

		var vm = this;

		var ida = $stateParams.appId;
		var ide = $stateParams.eventId;

		vm.showDialog = [];

		ApplicationResource.getAppById(ida).then(function(res){
			vm.application = res;

			EventResource.getEvent(ida, ide).then(function(res){
				vm.event = res;

				vm.typeStyle = function(type){
					var style = 'label label-primary';
					if(type.toUpperCase() === 'ERROR'){
						style = 'label label-danger';
					}
					else if(type.toUpperCase() === 'WARNING'){
						style = 'label label-warning';
					}
					else if(type.toUpperCase() === 'INFO'){
						style = 'label label-success';
					}	
					return style;
				}

				function filterEvents(){
					var eventList = [];
					angular.forEach(vm.application.events, function(value, key){
						if(value.fragment === vm.event.fragment && value._id !== vm.event._id){
							eventList.push(value);
						}
					});
					return eventList;
				}
				vm.filteredEvents = filterEvents();

				CommentResource.getEventComments(ide).then(function(res){
					vm.comments = res;
				})

			});

			vm.getUserCommented = function(uid){
				UserResource.getUserById(uid).then(function(res){
					vm.userCommented = res;
				});
			};

			vm.commentText = "";

			vm.postComment = function(){
				if(vm.commentText.trim().length > 0){
					var text = vm.commentText.trim();
					meanData.getLoggedUser().then(function(res){
						var owner = res.data._id;
						CommentResource.postEventComment(ide, text, owner).then(function(res){
							vm.comments = res.comments;
							vm.commentText = "";
						});
					});
				}
			};

			vm.replySubComment = function(c){
				vm.showDialog[c._id] = true;
				
			}

			vm.postSubComment = function(c){
				
				if(vm.subcommentText[c._id].trim().length > 0){
					var text = vm.subcommentText[c._id].trim();
					meanData.getLoggedUser().then(function(res){
						var owner = res.data._id;
						var comment = c._id;
						CommentResource.postEventSubComment(ide, text, owner, comment).then(function(res){
							vm.comments = res.comments;
							vm.subcommentText[c._id] = "";
						});
					});
				}
			};
			
		});
		
	});

	app.filter('unique', function() {
	   return function(collection, keyname) {
	      var output = [], 
	          keys = [];

	      angular.forEach(collection, function(item) {
	          var key = item[keyname];
	          if(keys.indexOf(key) === -1) {
	              keys.push(key);
	              output.push(item);
	          }
	      });

	      return output;
	   };
	});

})(angular);