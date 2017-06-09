(function () {
	app.controller('loginCtrl', function(authentication, $location){
		  var vm = this;

		  vm.credentials = {
		    email : "",
		    password : ""
		  };

		  vm.onSubmit = function () {
		    authentication.login(vm.credentials).then(function(){
		      $location.path('home');
		    });
		  };
	});

	app.controller('homeCtrl', function($location, meanData, $state, UserResource,authentication){
		  var vm = this;
		  vm.user = {};
		  $state.go('homelanding');
		  meanData.getLoggedUserApp()
		    .then(function(user) {
		      vm.user = {
		      	id: user.data._id,
		      	email: user.data.email,
		      	name: user.data.first_name,
		   	 }
		   	 console.log(vm.user);
		    }, function (e) {
		      console.log(e);
		    });

		    vm.logout = function(){
				if(authentication.getToken()){
					authentication.logout();
		    		$location.path('/');
				}else{
					UserResource.logoutUser().then(function(res){
						$location.path('/');
					});
				}
				
		    }
	});

	app.controller('someCtrl', function(){

	});
})();