(function () {
	app.controller('loginCtrl', function(authentication, $location){
		  var vm = this;

		  vm.credentials = {
		    email : "",
		    password : ""
		  };

		  vm.onSubmit = function () {
		    authentication
		    .login(vm.credentials)
		    .then(function(){
		      $location.path('home');
		    });
		  };
	});

	app.controller('homeCtrl', function($location, meanData, $state, UserResource){
		  var vm = this;
		  vm.user = {};
		  $state.go('homelanding');
		  meanData.getLoggedUser()
		    .then(function(user) {
		      vm.user = {
		      	id: user.data._id,
		      	email: user.data.email,
		      	name: user.data.name,
		   	 }
		   	 console.log(vm.user);
		    }, function (e) {
		      console.log(e);
		    });

		    vm.logout = function(){
		    	UserResource.logoutUser().then(function(res){
					 $location.path('land');
				});
		    }
	});

	app.controller('someCtrl', function(){

	});
})();